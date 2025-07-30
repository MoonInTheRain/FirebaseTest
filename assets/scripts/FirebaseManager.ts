import { Auth } from "@firebase/auth/dist/browser-cjs";
import { Firestore, Unsubscribe } from "@firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { Database, DataSnapshot } from "firebase/database";
import { GomokuData, GomokuDataWithId } from "./Define";
import { initializeApp } from "./FirebaseWrapper/FirebaseApp";
import { getAuth, onAuthStateChanged, signInAnonymously } from "./FirebaseWrapper/FirebaseAuth";
import { get, getDatabase, off, onChildChanged, onDisconnect, push, ref, remove, serverTimestampAtDB, set, update } from "./FirebaseWrapper/FirebaseDatabase";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "./FirebaseWrapper/FirebaseStore";
import { getMessaging, getToken } from "./FirebaseWrapper/FirebaseMessage";
import { Functions, getFunctions, httpsCallable } from "./FirebaseWrapper/FirebaseFunctions";
import { fetchAndActivate, getRemoteConfig, getValue, RemoteConfig } from "./FirebaseWrapper/FirebaseRemoteConfig";

/**
 * Firebaseのプロジェクトにアクセスするための情報
 */
const firebaseConfig = {
    apiKey: "AIzaSyAXej2b2FrBVZqOKjUjjERGM2XioQuPEM0",
    authDomain: "litegame-df1fe.firebaseapp.com",
    projectId: "litegame-df1fe",
    /** RealtimeDatabaseで必要 */
    databaseURL: "https://litegame-df1fe-default-rtdb.firebaseio.com",
    /** FirebaseMessageで必要 */
    appId: "1:213956204660:web:f09be0cacbd2566f6f1921",
    messagingSenderId: "213956204660",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let rdb: Database;
let functions: Functions;
let config: RemoteConfig;

let currentUID: string = null;

/**
 * Firebaseへの匿名サインイン・ログイン
 * @returns 
 */
export async function initFirebase(): Promise<void> {
    if (app) { return; }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rdb = getDatabase(app);
    functions = getFunctions(app);

    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUID = user.uid;
                console.log("ログイン済 UID:", currentUID);
                resolve();
            } else {
                try {
                    const result = await signInAnonymously(auth);
                    currentUID = result.user.uid;
                    console.log("匿名ログイン成功 UID:", currentUID);
                    resolve();
                } catch (err) {
                    console.error("匿名ログイン失敗:", err);
                    reject(err);
                }
            }
        });
    });
}

/**
 * FirebaseのログインユーザーIDを取得
 * @returns 
 */
export function getUserId() : string {
    return auth.currentUser?.uid || "anonymous";
}

// ---------------------------------------------
// --------------- TODOリスト周り ---------------
// ---------------------------------------------

/**
 * FirestoreへTODOリストを保存
 * @param data 
 * @returns 
 */
export async function saveTodoList(data: object): Promise<void> {
    if (!currentUID || !db) return;
    await setDoc(doc(db, "todo", currentUID), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

/**
 * FirestoreからTODOリストを取得する
 * @returns 
 */
export async function loadTodoList(): Promise<object> {
    if (!currentUID || !db) return;
    const docSnap = await getDoc(doc(db, "todo", currentUID));
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return [];
}

// -----------------------------------------------
// --------------- チャット機能周り ---------------
// -----------------------------------------------

/**
 * Firestoreからチャットのルーム一覧を取得する
 * @returns 
 */
export async function loadRoomList(): Promise<object> {
    if (!db) return;
    const docSnap = await getDocs(collection(db, "chats"));
    const rooms = docSnap.docs.map(doc => ({
        roomId: doc.id,
        ...doc.data()
    }));
    return rooms;
}

/**
 * Firestoreにチャットのルームを追加する
 * @param name 
 * @returns 
 */
export async function addRoom(name: string): Promise<string> {
    if (!db) { return; }
    const roomsRef = collection(db, "chats");

    const newRoom = {
        name: name,
        ownerId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(roomsRef, newRoom);
    return docRef.id;
}

/**
 * Firestoreの該当のチャットルームへの追加イベントの購読開始
 * @param roomId 
 * @param onNewMessage 
 * @returns 購読終了の関数
 */
export function connectRoom(roomId: string, onNewMessage: (msg: any) => void): Unsubscribe {
    const messagesRef = collection(db, "chats", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                data.isMine = data.senderId == auth.currentUser?.uid;
                onNewMessage(data);
            }
        });
    });
}

/**
 * Firestoreの該当のチャットルームへメッセージを送信
 * @param roomId 
 * @param text 
 */
export async function sendMessage(roomId: string, text: string): Promise<void> {
    const messagesRef = collection(db, "chats", roomId, "messages");
    await addDoc(messagesRef, {
        message: text,
        senderId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp()
    });
};

// -------------------------------------------
// --------------- 五目並べ周り ---------------
// -------------------------------------------

/**
 * RealtimeDBの五目並べのルーム一覧を取得
 * @returns 
 */
export async function getGomokuRooms(): Promise<GomokuDataWithId[]> {
    const roomsRef = ref(rdb, "rooms");

    const snapshot = await get(roomsRef);
    if (!snapshot.exists()) {
        return [];
    }
    const rooms = snapshot.val(); // object: { roomId: roomData, ... }

    const roomList = Object.entries(rooms).map(([roomId, data]) => {
        const room = data as GomokuData;
        return {
            roomId,
            ...room
        }
    });

    return roomList;
}

/**
 * RealtimeDBの五目並べのルームを取得
 * @returns 
 */
export async function getGomokuRoom(roomId:string): Promise<GomokuDataWithId> {
    const roomRef = ref(rdb, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
        throw new Error(`there is no room! roomId: ${roomId}`)
    }
    return snapshot.val();
}

/**
 * RealtimeDBに対して、新規の五目並べのルームを作成
 * @param roomName 
 * @param color 
 * @returns 
 */
export async function createRoom(roomName: string, color: "black" | "white"): Promise<GomokuDataWithId> {
    const BOARD_SIZE = 15;
    // NODE: nullで埋めたデータを作成した場合、realtimeDBには空っぽのデータとして保存されてしまうので"none"の文字列を入れる。
    const board = Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill("none")
    );
    // "rooms" の下に自動生成IDを持つノードを作成
    const roomRef = push(ref(rdb, "rooms"));
    const newData: GomokuDataWithId = {
        roomId: roomRef.key,
        name: roomName,
        players: {},
        board: board,
        turn: color == "black" ? "white" : "black",
        winner: "none",
        createdAt: serverTimestampAtDB(),
        connect: {}
    };
    newData.players[color] = getUserId();
    await set(roomRef, newData);
    return newData;
}

/**
 * RealtimeDBの五目並べのルームの情報を更新
 * @param roomData 
 */
export async function updateGomoku(roomData: GomokuDataWithId): Promise<void> {
    const roomRef = ref(rdb, `rooms/${roomData.roomId}`);
    await update(roomRef, roomData);
}

/**
 * RealtimeDBの五目並べのルームの変更イベントの購読開始
 * @param roomId 
 * @param callback 
 * @returns 購読終了のための無名関数
 */
export function connectGomokuRoom(roomId: string, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown): () => void {
    const roomRef = ref(rdb, `rooms/${roomId}`);
    onChildChanged(roomRef, callback);
    return () => {
        off(roomRef, "child_changed", callback);
    }
}

/**
 * RealtimeDMにユーザーのオンライン状態を設定
 * @param roomId 
 * @returns 
 */
export async function setGomokuRoomOnline(roomId: string): Promise<() => void> {
    const userId = getUserId();
    const connectRef = ref(rdb, `rooms/${roomId}/connect/${userId}`);
    // 接続が切れた際、オンライン情報を削除するようにする
    onDisconnect(connectRef).remove();
    await set(connectRef, true);
    return async () => {
        // 能動的に部屋を退出
        await remove(connectRef);
        // onDisconnect の登録を解除
        await onDisconnect(connectRef).cancel();
    }
}

// -------------------------------------------
// --------------- 五目並べ周り ---------------
// -------------------------------------------

/**
 * プッシュ通知の登録の返り
 */
interface RegisterPushTokenResponse {
    success : boolean;
}

/**
 * Messagingを用いてプッシュ通知トークンの取得とFunctionsをトークンをサーバーに保存する
 * @returns true: 保存成功
 */
export async function registerPushToken(): Promise<boolean> {
    await initFirebase();
    const messaging = getMessaging(app);
    // サービスワーカーがないとgetToken自体が失敗する。
    // このタイミングで通知許可がユーザーに求められるが、拒否するとエラーになる。ちゃんと作るならハンドリング必須。
    const token = await getToken(messaging, { vapidKey: "BPt2bsc3KsQ1e_U7brHAHJt6OVwi7djZU9CZmjQTao082Ljf1DT4cXV5ty6cBULshXadExwN9nN9FD-qXrkYIwE" });

    // Functionsを呼び出してトークンをサーバーに保存
    const registerPushToken = httpsCallable<unknown, RegisterPushTokenResponse>(functions, "registerPushToken");
    const response = await registerPushToken({ token });
    return response.data.success;
}

/**
 * Functionsを用いてトピック通知を行う
 */
export async function pushTopicNotificationTest(): Promise<void> {
    await initFirebase();
    const topic = "litegame_notice";
    const title = "test";
    const body = "てすとです。" + getTimeString();
    const func = httpsCallable<unknown, RegisterPushTokenResponse>(functions, "sendNotificationByTopic");
    const response = await func({ topic, title, body });
    console.log(response);
}

/**
 * Functionsを用いてトークン通知を行う
 */
export async function pushUserNotification(userId: string, boardRoomId: string): Promise<void> {
    await initFirebase();
    const title = "対戦相手が待っています";
    const body = `${getTimeString()} に通知しました`;
    const func = httpsCallable<unknown, RegisterPushTokenResponse>(functions, "sendNotificationByUserId");
    const response = await func({ userId, title, body, boardRoomId });
    console.log(response);
}

/**
 * 時間を文字列で取得
 * @returns 
 */
function getTimeString(): string {
    const date = new Date();
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ` + 
           `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

// ------------------------------------------------
// --------------- バージョン情報周り ---------------
// ------------------------------------------------

/**
 * バージョン情報を取得
 * @returns 
 */
export async function getAppVersion(): Promise<string> {
    await initFirebase();
    if (!config) {
        config = getRemoteConfig(app);
        config.settings = {
            minimumFetchIntervalMillis: 3600000,
            fetchTimeoutMillis: 60000
        };
        config.defaultConfig = {
            "APP_VERSION" : "0.0"
        }
    }
    const res = await fetchAndActivate(config);
    if (res) {
        // フェッチした時だけtrue
    }
    return getValue(config, "APP_VERSION").asString();
}
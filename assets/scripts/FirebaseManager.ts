import { Auth } from "@firebase/auth/dist/browser-cjs";
import { Firestore, Unsubscribe } from "@firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { Database, DataSnapshot } from "firebase/database";
import { GomokuColor, GomokuData, GomokuDataWithId } from "./Define";
import { initializeApp } from "./FirebaseWrapper/FirebaseApp";
import { getAuth, onAuthStateChanged, signInAnonymously } from "./FirebaseWrapper/FirebaseAuth";
import { get, getDatabase, off, onChildChanged, onDisconnect, push, ref, remove, serverTimestampAtDB, set, update } from "./FirebaseWrapper/FirebaseDatabase";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "./FirebaseWrapper/FirebaseStore";

const firebaseConfig = {
    apiKey: "AIzaSyAXej2b2FrBVZqOKjUjjERGM2XioQuPEM0",
    authDomain: "litegame-df1fe.firebaseapp.com",
    projectId: "litegame-df1fe",
    databaseURL: "https://litegame-df1fe-default-rtdb.firebaseio.com"
};

let app: FirebaseApp, auth: Auth, db: Firestore, rdb: Database;
let currentUID = null;

export async function initFirebase(): Promise<void> {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rdb = getDatabase(app);

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

export async function saveTodoList(data: object): Promise<void> {
    if (!currentUID || !db) return;
    await setDoc(doc(db, "todo", currentUID), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function loadTodoList(): Promise<object> {
    if (!currentUID || !db) return;
    const docSnap = await getDoc(doc(db, "todo", currentUID));
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return [];
}

export async function loadRoomList(): Promise<object> {
    if (!db) return;
    const docSnap = await getDocs(collection(db, "chats"));
    const rooms = docSnap.docs.map(doc => ({
        roomId: doc.id,
        ...doc.data()
    }));
    return rooms;
}

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

export async function sendMessage(roomId: string, text: string) {
    const messagesRef = collection(db, "chats", roomId, "messages");
    await addDoc(messagesRef, {
        message: text,
        senderId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp()
    });
};

export function getUserId() : string {
    return auth.currentUser?.uid || "anonymous";
}

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

export function initialBoard(): GomokuColor[][] {
    const BOARD_SIZE = 15;
    return Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill("none")
    );
}

export async function createRoom(roomName: string, color: "black" | "white"): Promise<GomokuDataWithId> {
    // "rooms" の下に自動生成IDを持つノードを作成
    const roomRef = push(ref(rdb, "rooms"));
    const newData: GomokuDataWithId = {
        roomId: roomRef.key,
        name: roomName,
        players: {},
        board: initialBoard(),
        turn: color == "black" ? "white" : "black",
        winner: "none",
        createdAt: serverTimestampAtDB(),
        connect: {}
    };
    newData.players[color] = getUserId();
    await set(roomRef, newData);
    return newData;
}

export async function updateGomoku(roomData: GomokuDataWithId): Promise<void> {
    const roomRef = ref(rdb, `rooms/${roomData.roomId}`);
    await update(roomRef, roomData);
}

export function connectGomokuRoom(roomId: string, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown): () => void {
    const roomRef = ref(rdb, `rooms/${roomId}`);
    onChildChanged(roomRef, callback);
    return () => {
        off(roomRef, "child_changed", callback);
    }
}

export async function setGomokuRoomOnline(roomId: string): Promise<() => void> {
    const userId = getUserId();
    const connectRef = ref(rdb, `rooms/${roomId}/connect/${userId}`);
    onDisconnect(connectRef).remove();
    await set(connectRef, true);
    return async () => {
        // 能動的に部屋を退出
        await remove(connectRef);
        // onDisconnect の登録を解除
        await onDisconnect(connectRef).cancel();
    }
}

export async function getRoom(roomId:string): Promise<GomokuDataWithId> {
    const roomRef = ref(rdb, `rooms/${roomId}`);
    return (await get(roomRef)).val();
}
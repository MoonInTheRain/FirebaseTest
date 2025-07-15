import { Auth } from "@firebase/auth/dist/browser-cjs";
import { Firestore, Unsubscribe } from "@firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { initializeApp } from "./FirebaseWrapper/FirebaseApp";
import { getAuth, onAuthStateChanged, signInAnonymously } from "./FirebaseWrapper/FirebaseAuth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "./FirebaseWrapper/FirebaseStore";
import { getDatabase, ref, push, set, serverTimestampAtDB, get } from "./FirebaseWrapper/FirebaseDatabase";
import { GomokuData, GomokuDataWithId } from "./Define";
import { Database } from "firebase/database";

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

export async function getGomokuRooms(): Promise<GomokuDataWithId[]> {
    const realtimeDB = getDatabase(app);
    const roomsRef = ref(realtimeDB, "rooms");

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

function initialBoard(): (null | 'black' | 'white')[][] {
    const BOARD_SIZE = 15;
    return Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill(null)
    );
}

export async function createRoomByBlack(roomName: string): Promise<GomokuDataWithId> {
    const db = getDatabase(app);
    // "rooms" の下に自動生成IDを持つノードを作成
    const roomRef = push(ref(db, "rooms"));
    const newData: GomokuDataWithId = {
        roomId: roomRef.key,
        name: roomName,
        players: {
            black: auth.currentUser?.uid || "anonymous",
        },
        board: initialBoard(),
        turn: "black",
        createdAt: serverTimestampAtDB()
    };
    await set(roomRef, newData);
    return newData;
}
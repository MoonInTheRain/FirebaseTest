import { Firestore, Unsubscribe } from "@firebase/firestore";
import { initializeApp } from "./FirebaseWrapper/FirebaseApp";
import { getAuth, onAuthStateChanged, signInAnonymously } from "./FirebaseWrapper/FirebaseAuth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "./FirebaseWrapper/FirebaseStore";
import { Auth } from "@firebase/auth/dist/browser-cjs";
import { FirebaseApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAXej2b2FrBVZqOKjUjjERGM2XioQuPEM0",
    authDomain: "litegame-df1fe.firebaseapp.com",
    projectId: "litegame-df1fe",
};

let app: FirebaseApp, auth: Auth, db: Firestore;
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
                onNewMessage(change.doc.data());
            }
        });
    });
}

export async function sendMessage(roomId: string, text: string) {
    const messagesRef = collection(db, "chats", roomId, "messages");
    const senderId = auth.currentUser?.uid || "anonymous";
    await addDoc(messagesRef, {
        text,
        senderId,
        createdAt: new Date()
    });
};
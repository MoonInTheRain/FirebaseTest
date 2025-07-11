import { initializeApp } from "./FirebaseWrapper/FirebaseApp";
import { getAuth, onAuthStateChanged, signInAnonymously } from "./FirebaseWrapper/FirebaseAuth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "./FirebaseWrapper/FirebaseStore";

const firebaseConfig = {
    apiKey: "AIzaSyAXej2b2FrBVZqOKjUjjERGM2XioQuPEM0",
    authDomain: "litegame-df1fe.firebaseapp.com",
    projectId: "litegame-df1fe",
};

let app, auth, db;
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

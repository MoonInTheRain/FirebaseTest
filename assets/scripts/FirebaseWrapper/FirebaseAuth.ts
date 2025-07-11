// @ts-ignore
import firebaseAuthCJS from "../../../node_modules/@firebase/auth/dist/browser-cjs/index.js";
import { ErrorFn, Auth, NextOrObserver, User, CompleteFn, Unsubscribe, UserCredential } from "../../../node_modules/@firebase/auth/dist/browser-cjs/index";
import { FirebaseApp } from "../../../node_modules/@firebase/app/dist/app";

/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
export function getAuth(app?: FirebaseApp): Auth {
    return firebaseAuthCJS.getAuth(app);
}

/**
 * Adds an observer for changes to the user's sign-in state.
 *
 * @remarks
 * To keep the old behavior, see {@link onIdTokenChanged}.
 *
 * @param auth - The {@link Auth} instance.
 * @param nextOrObserver - callback triggered on change.
 * @param error - Deprecated. This callback is never triggered. Errors
 * on signing in/out can be caught in promises returned from
 * sign-in/sign-out functions.
 * @param completed - Deprecated. This callback is never triggered.
 *
 * @public
 */
export function onAuthStateChanged(auth: Auth, nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe {
    return firebaseAuthCJS.onAuthStateChanged(auth, nextOrObserver, error, completed);
}

/**
 * Asynchronously signs in as an anonymous user.
 *
 * @remarks
 * If there is already an anonymous user signed in, that user will be returned; otherwise, a
 * new anonymous user identity will be created and returned.
 *
 * This method is not supported by {@link Auth} instances created with a
 * {@link @firebase/app#FirebaseServerApp}.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export function signInAnonymously(auth: Auth): Promise<UserCredential> {
    return firebaseAuthCJS.signInAnonymously(auth);
}
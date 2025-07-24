// @ts-ignore
import { FirebaseApp } from "../../../node_modules/@firebase/app/dist/app";
import { Messaging, GetTokenOptions} from "../../../node_modules/@firebase/messaging";
import firebaseMessagingCJS from "../../../node_modules/@firebase/messaging/dist/index.cjs.js";

/**
 * Retrieves a Firebase Cloud Messaging instance.
 *
 * @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
 *
 * @public
 */
export function getMessaging(app?: FirebaseApp): Messaging {
    return firebaseMessagingCJS.getMessaging(app);
}

/**
 * Subscribes the {@link Messaging} instance to push notifications. Returns a Firebase Cloud
 * Messaging registration token that can be used to send push messages to that {@link Messaging}
 * instance.
 *
 * If notification permission isn't already granted, this method asks the user for permission. The
 * returned promise rejects if the user does not allow the app to show notifications.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param options - Provides an optional vapid key and an optional service worker registration.
 *
 * @returns The promise resolves with an FCM registration token.
 *
 * @public
 */
export function getToken(messaging: Messaging, options?: GetTokenOptions): Promise<string> {
    return firebaseMessagingCJS.getToken(messaging, options);
}
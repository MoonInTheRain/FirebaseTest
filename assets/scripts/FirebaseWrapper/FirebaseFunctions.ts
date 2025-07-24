// @ts-ignore
import { FirebaseApp } from "../../../node_modules/@firebase/app/dist/app";
import { Functions, HttpsCallableOptions, HttpsCallable } from "../../../node_modules/@firebase/functions";
import firebaseFunctionsCJS from "../../../node_modules/@firebase/functions/dist/index.cjs.js";
export type { Functions };

/**
 * Returns a {@link Functions} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param regionOrCustomDomain - one of:
 *   a) The region the callable functions are located in (ex: us-central1)
 *   b) A custom domain hosting the callable functions (ex: https://mydomain.com)
 * @public
 */
export function getFunctions(app?: FirebaseApp, regionOrCustomDomain?: string): Functions {
    return firebaseFunctionsCJS.getFunctions(app, regionOrCustomDomain);
}

/**
 * Returns a reference to the callable HTTPS trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
export function httpsCallable<RequestData = unknown, ResponseData = unknown, StreamData = unknown>(functionsInstance: Functions, name: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData, StreamData> {
    return firebaseFunctionsCJS.httpsCallable(functionsInstance, name, options);
}


import firebaseRemoteConfigCJS  from '../../../node_modules/@firebase/remote-config/dist/index.cjs.js';
import { FirebaseApp } from "firebase/app";
import { RemoteConfigOptions, RemoteConfig, Value } from "firebase/remote-config";
export type { RemoteConfigOptions, RemoteConfig };

/**
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 * @param options - Optional. The {@link RemoteConfigOptions} with which to instantiate the
 *     Remote Config instance.
 * @returns A {@link RemoteConfig} instance.
 *
 * @public
 */
export function getRemoteConfig(app?: FirebaseApp, options?: RemoteConfigOptions): RemoteConfig {
    return firebaseRemoteConfigCJS.getRemoteConfig(app, options);
}
/**
 *
 * Performs fetch and activate operations, as a convenience.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
export function fetchAndActivate(remoteConfig: RemoteConfig): Promise<boolean>{
    return firebaseRemoteConfigCJS.fetchAndActivate(remoteConfig);
}

/**
 * Gets the {@link Value} for the given key.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key.
 *
 * @public
 */
export function getValue(remoteConfig: RemoteConfig, key: string): Value {
    return firebaseRemoteConfigCJS.getValue(remoteConfig, key);
}

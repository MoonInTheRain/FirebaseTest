// @ts-ignore
import { FirebaseApp } from "../../../node_modules/@firebase/app/dist/app";
import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FieldPath,
    FieldValue,
    Firestore,
    FirestoreError,
    OrderByDirection,
    PartialWithFieldValue,
    Query,
    QueryCompositeFilterConstraint,
    QueryConstraint,
    QueryNonFilterConstraint,
    QueryOrderByConstraint,
    QuerySnapshot,
    SetOptions,
    SnapshotListenOptions,
    Unsubscribe,
    WithFieldValue
} from "../../../node_modules/@firebase/firestore/dist/index";
import firebaseStoreCJS from "../../../node_modules/@firebase/firestore/dist/index.cjs.js";

/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @returns The default {@link Firestore} instance of the provided app.
 */
export function getFirestore(app: FirebaseApp): Firestore {
    return firebaseStoreCJS.getFirestore(app);
}

/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<void>;
/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * @returns A Promise resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): Promise<void>;

export function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>, options?: SetOptions): Promise<void> {
    return firebaseStoreCJS.setDoc(reference, data, options);
}

/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export function getDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>> {
    return firebaseStoreCJS.getDoc(reference);
}


/**
 * Gets a `DocumentReference` instance that refers to the document at the
 * specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path. If no path is specified, an
 * automatically-generated unique ID will be used for the returned
 * `DocumentReference`.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a document. Has to be omitted to use
 * auto-generated IDs.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export function doc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path?: string, ...pathSegments: string[]): DocumentReference<AppModelType, DbModelType>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export function doc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;

export function doc(reference, path, ...n): DocumentReference<DocumentData, DocumentData> {
    return firebaseStoreCJS.doc(reference, path, ...n);
}

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export function getDocs<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>> {
    return firebaseStoreCJS.getDocs(query);
}

/**
 * Gets a `CollectionReference` instance that refers to the collection at
 * the specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export function collection<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export function collection<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;

export function collection(reference, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData> {
    return firebaseStoreCJS.collection(reference, path, ...pathSegments);
}

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */
export function addDoc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<DocumentReference<AppModelType, DbModelType>> {
    return firebaseStoreCJS.addDoc(reference, data);
}

/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;

export function onSnapshot(e, ...t): Unsubscribe {
    return firebaseStoreCJS.onSnapshot(e, ...t);
}

/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param compositeFilter - The {@link QueryCompositeFilterConstraint} to
 * apply. Create {@link QueryCompositeFilterConstraint} using {@link and} or
 * {@link or}.
 * @param queryConstraints - Additional {@link QueryNonFilterConstraint}s to
 * apply (e.g. {@link orderBy}, {@link limit}).
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, compositeFilter: QueryCompositeFilterConstraint, ...queryConstraints: QueryNonFilterConstraint[]): Query<AppModelType, DbModelType>;
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, ...queryConstraints: QueryConstraint[]): Query<AppModelType, DbModelType>;

export function query(e, t, ...n) {
    return firebaseStoreCJS.query(e, t, ...n);
}

/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */
export function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint {
    return firebaseStoreCJS.orderBy(fieldPath, directionStr);
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */
export function serverTimestamp(): FieldValue {
    return firebaseStoreCJS.serverTimestamp();
}

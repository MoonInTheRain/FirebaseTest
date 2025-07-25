/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
functions.setGlobalOptions({maxInstances: 10});

admin.initializeApp();

interface RegisterPushTokenRequest {
  token: string;
}

export const registerPushToken = functions.https.onCall(
  async (request: functions.https.CallableRequest<RegisterPushTokenRequest>) => {
    const {token} = request.data;
    const topic = "litegame_notice";
    const uid = request.auth?.uid;
    if (!uid || !token || !topic) {
      throw new functions.https.HttpsError("invalid-argument", "token, topic required");
    }

    // Firestore に保存（必要なら複数トークンを管理する設計も可）
    const db = admin.firestore();
    await db.collection("user_tokens").doc(uid).set({
      token,
      updatedAt: Date.now(),
    });

    // トピック購読
    await admin.messaging().subscribeToTopic([token], topic);

    console.log(`ユーザー ${uid} のトークンをトピック ${topic} に登録`);
    return {success: true};
  }
);

interface SendNotificationByTopicRequest {
  topic: string;
  title: string;
  body: string;
}

export const sendNotificationByTopic = functions.https.onCall(
  async (request: functions.https.CallableRequest<SendNotificationByTopicRequest>) => {
    const {topic, title, body} = request.data;

    if (!title || !body || !topic) {
      throw new functions.https.HttpsError("invalid-argument", "必要なパラメータが不足しています");
    }

    const message: admin.messaging.Message = {
      data: {title, body},
      topic,
    };

    try {
      const res = await admin.messaging().send(message);
      console.log("通知送信成功:", res);
      return {success: true, messageId: res};
    } catch (err) {
      console.error("通知送信失敗:", err);
      throw new functions.https.HttpsError("internal", "通知送信に失敗しました");
    }
  }
);

interface SendNotificationByUserIdRequest {
  userId: string;
  title: string;
  body: string;
  boardRoomId: string | undefined;
}

export const sendNotificationByUserId = functions.https.onCall(
  async (request: functions.https.CallableRequest<SendNotificationByUserIdRequest>) => {
    const {userId, title, body, boardRoomId} = request.data;

    if (!title || !body || !userId) {
      throw new functions.https.HttpsError("invalid-argument", "必要なパラメータが不足しています");
    }

    const token = await getToken(userId);
    const message: admin.messaging.Message = {
      data: {title, body, ...(boardRoomId != undefined ? {boardRoomId} : {})},
      token,
    };
    console.log("message:", message);

    try {
      const res = await admin.messaging().send(message);
      console.log("通知送信成功:", res);
      return {success: true, messageId: res};
    } catch (err) {
      console.error("通知送信失敗:", err);
      throw new functions.https.HttpsError("internal", "通知送信に失敗しました");
    }
  }
);

const getToken = async (userId: string): Promise<string> => {
  const userDoc = await admin.firestore().collection("user_tokens").doc(userId).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "ユーザーが存在しません");
  }

  const token = userDoc.data()?.token;

  if (!token) {
    throw new functions.https.HttpsError("not-found", "トークンが登録されていません");
  }

  return token;
};

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebaseの初期化（Webアプリと同じconfig）
firebase.initializeApp({
  apiKey: "AIzaSyAXej2b2FrBVZqOKjUjjERGM2XioQuPEM0",
  projectId: "litegame-df1fe",
  messagingSenderId: "213956204660",
  appId: "1:213956204660:web:f09be0cacbd2566f6f1921"
});

const messaging = firebase.messaging();

// バックグラウンド通知を受け取ったときの処理
messaging.onBackgroundMessage(payload => {
  console.log('[Service Worker] 通知を受信:', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/icon.png', // 任意のアイコン
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

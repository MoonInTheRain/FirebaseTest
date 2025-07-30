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
messaging.onBackgroundMessage((payload) => {
  if (!payload.data || !payload.data.title || !payload.data.body) {
    return;  // 何もしない
  }
  console.log('[SW] 背景通知受信:', payload);
  const { title, body, boardRoomId } = payload.data;

  // 通知を表示する
  self.registration.showNotification(title, {
    body,
    icon: '/icon.png', // 任意のアイコン
    data: { boardRoomId },  // 通知クリックで使用
  });
});

// 通知クリック処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        // 同一オリジンのタブが開いていればフォーカス
        return clientList[0].focus();
      }
      if (clients.openWindow) {
        let targetUrl = self.location.origin;
        // boardRoomIdがあれば、クエリパラメータとして渡す
        if (event.notification.data?.boardRoomId) {
            targetUrl += "?boardRoomId=" + event.notification.data.boardRoomId
        }
        return clients.openWindow(targetUrl);
      }
    })
  );
});
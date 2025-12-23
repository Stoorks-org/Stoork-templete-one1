importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBTcxZ9bbNxdF7GiKHZ3GUa8e3ehzyBCuQ",
  authDomain: "stoorks-b11ba.firebaseapp.com",
  projectId: "stoorks-b11ba",
  storageBucket: "stoorks-b11ba.firebasestorage.app",
  messagingSenderId: "129470693273",
  appId: "1:129470693273:web:0bf4e68324000318d61d08",
  measurementId: "G-BFQ5GKDT6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);
  
    // Send a message to the main thread (the Angular app) to notify about the new message
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NEW_MESSAGE', // Custom event type to identify the message
          payload: payload.data, // You can send custom data here, like the message content or ID
        });
      });
    });});
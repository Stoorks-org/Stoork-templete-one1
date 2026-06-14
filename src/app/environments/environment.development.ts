// TEST environment — used during `ng serve` and `ng build --configuration development`.
// angular.json swaps environment.ts for this file in the development configuration,
// so local dev always points at the test API. Production builds use environment.ts.
export const environment: any = {
  production: false,
  apiUrl: 'https://bigchefacademy.com',
  authUrl: 'https://bigchefacademy.com',
  firebase: {
    apiKey: "AIzaSyBTcxZ9bbNxdF7GiKHZ3GUa8e3ehzyBCuQ",
    authDomain: "stoorks-b11ba.firebaseapp.com",
    projectId: "stoorks-b11ba",
    storageBucket: "stoorks-b11ba.firebasestorage.app",
    messagingSenderId: "129470693273",
    appId: "1:129470693273:web:0bf4e68324000318d61d08",
    measurementId: "G-BFQ5GKDT6X"
  },
  vapidKey: "BCmFm5E8ValkPMNt1bGFhvox3LG-5hGE_LkJCImu3eKxvS8Yu8DUK3bQvva3CxICeTyX_YrUTmEqNq_6OLKqj6k",
};

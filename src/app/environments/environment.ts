// PRODUCTION environment — used by `ng build` (defaultConfiguration: production).
// During `ng serve` / development this file is swapped for environment.development.ts
// via angular.json fileReplacements, so dev always hits the test API instead.
export const environment: any = {
  production: true,
  apiUrl: 'https://stoorks.com',
  authUrl: 'https://stoorks.com',
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

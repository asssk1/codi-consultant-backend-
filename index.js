const functions = require("firebase-functions");
const app = require("./server");

// 🔹 Firebase Functions에 Express 앱 연결
exports.api = functions.https.onRequest(app);

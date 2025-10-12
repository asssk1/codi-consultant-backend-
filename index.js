import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { signupUser, loginUser } from "./auth.js";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// 라우트 등록
app.post("/api/signup", signupUser);
app.post("/api/login", loginUser);

// Firebase Functions로 export
export const api = functions.https.onRequest(app);

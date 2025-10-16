import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

const app = express();
app.use(cors());
app.use(express.json());

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ✅ 회원가입
app.post("/api/signup", async (req, res) => {
  const { name, dob, email, password } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });

  const userRef = db.collection("users").doc(email);
  const existing = await userRef.get();
  if (existing.exists)
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });

  await userRef.set({ name, dob, email, password });
  res.json({ message: "회원가입 성공!" });
});

// ✅ 로그인
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const userRef = db.collection("users").doc(email);
  const userDoc = await userRef.get();

  if (!userDoc.exists)
    return res.status(400).json({ message: "존재하지 않는 이메일입니다." });

  const user = userDoc.data();
  if (user.password !== password)
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  res.json({ message: "로그인 성공!", user });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));

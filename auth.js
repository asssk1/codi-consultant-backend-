import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// 회원가입
export const signupUser = async (req, res) => {
  try {
    const { name, dob, email, password } = req.body;

    if (!email || !password || !name || !dob) {
      return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      dob,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "회원가입 성공",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 로그인 (커스텀 토큰 발급)
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "이메일이 필요합니다." });

    const user = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(user.uid);

    return res.status(200).json({
      message: "로그인 토큰 발급 성공",
      token: customToken,
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return res.status(400).json({ message: "로그인 실패" });
  }
};

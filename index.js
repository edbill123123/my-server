const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sendPhoneCode, verifyPhoneCode, sendEmailCode, verifyEmailCode, verifyGoogleLogin, verifyFacebookLogin } = require("./verification")


// 創建 express 應用
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (_req, res) => {
  res.send('Hello, Express!');
});

app.use(cors({
  origin: "https://edbill123123.github.io/demo1/#/Authentication",  // 前端應用的 URL
  methods: ['GET', 'POST'],  // 允許的 HTTP 方法
}));

// 設置 COOP 和 COEP 標頭
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // 或者 'unsafe-none'
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // 或者 'unsafe-none'
  next();
});

// 使用 body-parser 解析 JSON 格式的請求體
app.use(bodyParser.json());

app.post("/phone/sendCode", sendPhoneCode);
app.post("/phone/verifyCode", verifyPhoneCode);
app.post("/email/sendCode", sendEmailCode);
app.post("/email/verifyCode", verifyEmailCode);
app.post("/auth/google", verifyGoogleLogin);
app.post("/auth/facebook", verifyFacebookLogin);

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});

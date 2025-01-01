const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// 假設這些是你導入的驗證方法
const { sendPhoneCode, verifyPhoneCode, sendEmailCode, verifyEmailCode, verifyGoogleLogin, verifyFacebookLogin } = require("./verification");

const app = express();

// 中間件
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// 路由設置
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.post("/phone/sendCode", sendPhoneCode);
app.post("/phone/verifyCode", verifyPhoneCode);
app.post("/email/sendCode", sendEmailCode);
app.post("/email/verifyCode", verifyEmailCode);
app.post("/auth/google", verifyGoogleLogin);
app.post("/auth/facebook", verifyFacebookLogin);

// 將 Express 應用導出，Vercel 將使用此應用處理請求
module.exports = app;

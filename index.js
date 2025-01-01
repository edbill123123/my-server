const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sendPhoneCode, verifyPhoneCode, sendEmailCode, verifyEmailCode, verifyGoogleLogin, verifyFacebookLogin } = require("./verification");

const app = express();

// 中間件設定
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// API 路由
app.post("/phone/sendCode", sendPhoneCode);
app.post("/phone/verifyCode", verifyPhoneCode);
app.post("/email/sendCode", sendEmailCode);
app.post("/email/verifyCode", verifyEmailCode);
app.post("/auth/google", verifyGoogleLogin);
app.post("/auth/facebook", verifyFacebookLogin);

// 模擬運行應用（不需要 listen）
module.exports = app;

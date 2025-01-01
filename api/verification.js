const { OAuth2Client } = require("google-auth-library");
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const phoneClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const emailVerificationData = {};
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "edbill123123@gmail.com",
    pass: "orkf flff pvil gdyq",
  },
});

//發送手機驗證碼
const sendPhoneCode = async (req, res) => {

  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    await phoneClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    res.status(200).json({ message: `Verification code sent to ${phoneNumber}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//驗證手機驗證碼
const verifyPhoneCode = async (req, res) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) {
    return res.status(400).json({ error: 'Phone number and code are required' });
  }

  try {
    const verificationCheck = await phoneClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ message: 'Phone number verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//發送信箱驗證碼
const sendEmailCode = (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  emailVerificationData[email] = verificationCode;
  console.log(verificationCode);
  transporter.sendMail(
    {
      from: "edbill123123@gmail.com",
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    },
    (error) => {
      if (error) {
        return res.status(500).send('Failed to send email');
      }
      res.send('Verification code sent');
    }
  );
}

//驗證信箱驗證碼
const verifyEmailCode = (req, res) => {
  const { email, code } = req.body;
  console.log("code "+ code);
  console.log(emailVerificationData[email]);
  try {
    // 驗證資料是否存在且符合
    if (emailVerificationData[email] && emailVerificationData[email] === code) {
      // 驗證成功：刪除驗證碼並回傳成功訊息
      delete emailVerificationData[email];
      return res.status(200).json({ success: true });
    } else {
      // 驗證失敗：回傳錯誤訊息
      return res.status(400).json({ success: false, error: 'Invalid verification code or email' });
    }
  } catch (error) {
    // 錯誤處理：伺服器內部錯誤
    res.status(500).json({ success: false, error: error.message });
  }
};


//google登入驗證
const verifyGoogleLogin = async (req, res) => {
  // 初始化 Google OAuth2 客戶端
  const client = new OAuth2Client("276752697110-g63lub9tkmg47jrk36mi20pocdiolntb.apps.googleusercontent.com");
  const { credential } = req.body;  // 從請求中取得 JWT

  if (!credential) {
    return res.status(400).json({ error: "No credential provided" });
  }

  try {
    // 驗證 Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: "276752697110-g63lub9tkmg47jrk36mi20pocdiolntb.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();  // 取得解碼後的 payload

    // 返回用戶資料
    res.json({ user: payload });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

//facebook登入驗證
const verifyFacebookLogin = (req, res) => {

};

module.exports = {
  sendPhoneCode,
  verifyPhoneCode,
  sendEmailCode,
  verifyEmailCode,
  verifyGoogleLogin,
  verifyFacebookLogin
}
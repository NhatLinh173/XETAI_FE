import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebaseConfig";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const history = useHistory();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const showToast = (type, message) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone.startsWith("+")) {
      return "+84" + phone.slice(1);
    }
    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      showToast("error", "Vui lòng nhập số điện thoại của bạn!");
      return;
    }

    setLoading(true);
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      console.log(formattedPhoneNumber);
      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified:", response);
          },
          "expired-callback": () => {
            console.error("Recaptcha expired");
          },
        },
        auth
      );

      await recaptchaVerifier.render();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );

      setVerificationId(confirmationResult.verificationId);
      showToast("success", "Mã OTP đã được gửi!");
      setShowOtpInput(true);
    } catch (error) {
      showToast("error", error.message || "Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      showToast("error", "Vui lòng nhập mã OTP!");
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otpCode);
      await signInWithCredential(auth, credential);
      showToast("success", "Xác thực thành công!");
      history.push("/reset-password");
    } catch (error) {
      showToast(
        "error",
        error.message || "Mã OTP không chính xác hoặc đã hết hạn!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Nhập số điện thoại của bạn"
            required
          />
        </div>
        {!showOtpInput && (
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Đang gửi..." : "Gửi yêu cầu OTP"}
          </button>
        )}
      </form>

      {showOtpInput && (
        <form onSubmit={handleVerifyOtp} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="otpCode">Mã OTP:</label>
            <input
              type="text"
              id="otpCode"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Nhập mã OTP của bạn"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Đang xác thực..." : "Xác thực mã OTP"}
          </button>
        </form>
      )}

      <div id="recaptcha-container"></div>

      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

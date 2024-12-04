import axiosInstance from "../../../config/axiosConfig";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons

const ChangePassWord = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const res = await axiosInstance.put(
          "/auth/change-password",
          {
            oldPassword: currentPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success("Đổi mật khẩu thành công !");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        console.error(error);
        toast.error("Mật khẩu cũ không đúng");
      }
    } else {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
    }
  };

  return (
    <div>
      <h2 className="mb-5">Thay đổi mật khẩu</h2>
      <form>
        <div className="row align-items-center">
          <div className="col-3 font-weight-bold">
            <label htmlFor="current_password">Mật khẩu hiện tại:</label>
          </div>
          <div className="col-9">
            <div className="input-group">
              <input
                className="input-password border position-relative text-decoration-none"
                type={showCurrentPassword ? "text" : "password"}
                id="current_password"
                name="current_password"
                placeholder="Nhập mật khẩu hiện tại"
                onChange={handleCurrentPasswordChange}
                value={currentPassword}
                required
              />
              <button
                className="btn btn-outline-secondary position-absolute"
                style={{
                  right: "165px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#999",
                }}
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="row align-items-center">
          <div className="col-3 font-weight-bold">
            <label htmlFor="new_password">Mật khẩu mới:</label>
          </div>
          <div className="col-9">
            <div className="input-group">
              <input
                className="input-password border position-relative text-decoration-none"
                placeholder="Nhập mật khẩu mới"
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                onChange={handleNewPasswordChange}
                value={newPassword}
                required
              />
              <button
                className="btn btn-outline-secondary position-absolute"
                style={{
                  right: "165px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#999",
                }}
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="row align-items-center">
          <div className="col-3 font-weight-bold">
            <label htmlFor="confirm_password">Xác nhận mật khẩu:</label>
          </div>
          <div className="col-9">
            <div className="input-group">
              <input
                className="input-password border position-relative text-decoration-none"
                placeholder="Nhập xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
                required
              />
              <button
                className="btn btn-outline-secondary position-absolute"
                style={{
                  right: "165px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#999",
                }}
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="row justify-content-center pb-3">
          <button
            className="btn btn-primary btn-lg w-25 text-white mt-4"
            onClick={handleSubmit}
          >
            <span>Cập Nhật</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassWord;

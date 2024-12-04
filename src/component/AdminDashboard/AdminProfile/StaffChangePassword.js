import React, { useState } from "react";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminChangePassword = () => {
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
    <div className="admin-profile-container" style={{ marginTop: "100px" }}>
      <h3 className="admin-profile-title">Đổi mật khẩu</h3>

      <div className="admin-profile-detail-field">
        <label htmlFor="currentPassword" className="admin-profile-label">
          Mật khẩu hiện tại
        </label>
        <div className="position-relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="current_password"
            className="form-control"
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <span
            className="position-absolute"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="admin-profile-detail-field">
        <label htmlFor="newPassword" className="admin-profile-label">
          Mật khẩu mới
        </label>
        <div className="position-relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            className="form-control"
            onChange={handleNewPasswordChange}
            value={newPassword}
            placeholder="Nhập mật khẩu mới"
          />
          <span
            className="position-absolute"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="admin-profile-detail-field">
        <label htmlFor="confirmNewPassword" className="admin-profile-label">
          Xác nhận mật khẩu mới
        </label>
        <div className="position-relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmNewPassword"
            className="form-control"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            placeholder="Nhập xác nhận mật khẩu"
          />
          <span
            className="position-absolute"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="admin-profile-save-section">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default AdminChangePassword;

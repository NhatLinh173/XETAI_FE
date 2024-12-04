import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import useInstanceData from "../../../config/useInstanceData";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosConfig";
import axios from "axios";
import { CiCamera } from "react-icons/ci";

const AdminProfile = () => {
  const [fullNameStaff, setFullNameStaff] = useState("");
  const [emailStaff, setEmailStaff] = useState("");
  const [role, setRole] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatar, setAvarta] = useState("");

  const userId = localStorage.getItem("userId");
  console.log(userId);

  const { data: staff, refetch } = useInstanceData(`/auth/user/${userId}`);
  console.log(staff);
  useEffect(() => {
    let objectUrl;
    if (newAvatar instanceof File) {
      objectUrl = URL.createObjectURL(newAvatar);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [newAvatar]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      console.log("Avatar changed", file);
    }
  };
  useEffect(() => {
    const handleAvatarUpdate = () => {
      const avatarFromLocalStorage =
        localStorage.getItem("avatar") || avatarDefault;
      setNewAvatar(avatarFromLocalStorage);
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    handleAvatarUpdate();

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      fullNameStaff === staff.fullName &&
      emailStaff === staff.email &&
      !newAvatar
    ) {
      toast.error("Không có thay đổi nào để cập nhật");
      return;
    } else {
      try {
        let avatarUrl = avatar;
        if (newAvatar) {
          const formData = new FormData();
          formData.append("file", newAvatar);
          formData.append("upload_preset", "Transaction");
          try {
            const cloudinaryRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dqzsoudfk/image/upload",
              formData
            );
            if (cloudinaryRes.data.secure_url) {
              avatarUrl = cloudinaryRes.data.secure_url;
            } else {
              throw new Error("Cloudinary did not return a URL");
            }
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            toast.error("Lỗi tải ảnh lên Cloudinary");
            return;
          }
        }
        const res = await axiosInstance.put(
          `http://localhost:3005/auth/update-user/${userId}`,
          {
            fullName: fullNameStaff,
            email: emailStaff,
            avatar: avatarUrl,
          }
        );
        if (res.status === 200) {
          toast.success("Cập nhật thông tin thành công!");
          localStorage.setItem("avatar", avatarUrl);
          setNewAvatar(avatarUrl);
          if (refetch) refetch();
          window.dispatchEvent(new Event("avatarUpdated"));
        }
      } catch (error) {
        toast.error("có lỗi xảy ra!!");
      }
    }
  };
  const handleFullNameStaff = (e) => {
    setFullNameStaff(e.target.value);
    console.log(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailStaff(e.target.value);
  };

  useEffect(() => {
    setFullNameStaff(staff.fullName);
    setEmailStaff(staff.email);
    setRole(staff.role);
    setAvarta(staff.avatar);
  }, [staff.fullName, staff.email, staff.role, staff.avatar]);

  return (
    <div className="admin-profile-container" style={{ marginTop: "100px" }}>
      <h2 className="admin-profile-title">Thông tin cá nhân</h2>
      <div className="avatar d-inline-block ">
        <div className="avt-img">
          <img
            className="rounded-circle"
            src={
              newAvatar instanceof File
                ? URL.createObjectURL(newAvatar)
                : avatar || avatarDefault
            }
            alt="avatar"
            style={{ width: "100px", height: "100px" }}
            onError={(e) => {
              e.target.src = avatarDefault;
            }}
          />
          <label htmlFor="avatar-upload" className="icon-avt rounded-circle">
            <CiCamera />
          </label>
          <input
            type="file"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className="admin-profile-details-section">
        <div className="admin-profile-detail-field">
          <label htmlFor="name" className="admin-profile-label">
            Họ và tên
          </label>
          <input
            type="text"
            name="name"
            className="admin-profile-input"
            onChange={handleFullNameStaff}
            value={fullNameStaff}
          />
        </div>

        <div className="admin-profile-detail-field">
          <label htmlFor="email" className="admin-profile-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="admin-profile-input"
            onChange={handleEmailChange}
            value={emailStaff}
          />
        </div>

        <div className="admin-profile-detail-field">
          <label htmlFor="role" className="admin-profile-label">
            Chức vụ
          </label>
          <input
            type="text"
            name="role"
            className="admin-profile-input admin-profile-disabled-input"
            value={role}
            disabled
          />
        </div>
      </div>

      <div className="admin-profile-save-section">
        <button
          className="admin-profile-save-button"
          onClick={handleSubmitForm}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;

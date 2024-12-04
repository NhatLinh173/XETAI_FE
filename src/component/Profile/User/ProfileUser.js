import React, { useState, useEffect } from "react";
import { CiCamera } from "react-icons/ci";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosConfig";
import axios from "axios";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
const ProfileUser = ({ data, refetch }) => {
  const { email, fullName, phone, address, _id, avatar } = data;
  const [isName, setIsName] = useState(true);
  const [isPhone, setIsPhone] = useState(true);
  const [isEmail, setIsEmail] = useState(true);
  const [isAddress, setIsAddress] = useState(true);
  const [isAvatar, setIsAvatar] = useState(true);

  const [newAvatar, setNewAvatar] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");

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

  // set lại ô input
  const inputName = (e) => {
    e.preventDefault();
    setIsName(false);
  };
  const inputPhone = (e) => {
    e.preventDefault();
    setIsPhone(false);
  };
  const inputEmail = (e) => {
    e.preventDefault();
    setIsEmail(false);
  };
  const inputAddress = (e) => {
    e.preventDefault();
    setIsAddress(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      console.log("Avatar changed", file);
    }
  };

  // dùng để giữ lại giá trị của ô input
  useEffect(() => {
    setNewName(fullName);
    setNewPhone(phone);
    setNewEmail(email);
    setNewAddress(address);
    if (avatar) {
      setNewAvatar(null);
    }
  }, [fullName, phone, email, address]);

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

  const handlenewAddress = (e) => {
    setNewAddress(e.target.value);
  };
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setNewPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };
  /////////////////////
  const cancelChangeName = (e) => {
    e.preventDefault();
    setIsName(true);
  };
  const cancelChangePhone = (e) => {
    e.preventDefault();
    setIsPhone(true);
  };
  const cancelChangeEmail = (e) => {
    e.preventDefault();
    setIsEmail(true);
  };
  const cancelChangeAddress = (e) => {
    e.preventDefault();
    setIsAddress(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      newName == fullName &&
      email == newEmail &&
      address == newAddress &&
      phone == newPhone &&
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
          `http://https://xetai-be.vercel.app/auth/update-user/${_id}`,
          {
            fullName: newName,
            phone: newPhone,
            email: newEmail,
            address: newAddress,
            avatar: avatarUrl,
          }
        );
        if (res.status === 200) {
          toast.success("Cập nhật thông tin thành công!");

          localStorage.setItem("avatar", avatarUrl);
          setNewAvatar(avatarUrl);
          if (refetch) refetch();
          window.dispatchEvent(new Event("avatarUpdated"));

          setIsName(true);
          setIsPhone(true);
          setIsEmail(true);
          setIsAddress(true);
        }
      } catch (error) {
        toast.error("Cập nhật thông tin không thành công!!");
      }
    }
  };

  return (
    <div>
      <div>
        <h2>Thông Tin</h2>
      </div>
      <div>
        <form className="mt-4">
          <div className="avatar ">
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
              <label
                htmlFor="avatar-upload"
                className="icon-avt rounded-circle p-1   "
              >
                <CiCamera className="mb-2" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="row g-3 align-item-center">
            <div className="col-3">
              <label for="name" className="col-form-label font-weight-bold">
                Họ và Tên:
              </label>
            </div>
            <div className="col-9">
              {fullName && isName ? (
                <div className="d-flex align-items-center justify-content-between  ">
                  <p className="text-input">{fullName}</p>
                  <button className="btn-change " onClick={inputName}>
                    <i className="fas fa-pencil-alt"></i> Thay đổi
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between ">
                  <input
                    type="text"
                    id="name"
                    value={newName}
                    onChange={handleNameChange}
                    className="form-control w-50 border"
                    placeholder="Nhập Họ và Tên"
                  />
                  <button className="btn-cancel " onClick={cancelChangeName}>
                    <i className="fas fa-times p-1"></i>Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row g-3 align-items-center ">
            <div className="col-3">
              <label for="phone" className="col-form-label font-weight-bold">
                Số Điện Thoại:
              </label>
            </div>
            <div className="col-9">
              {phone && isPhone ? (
                <div className="d-flex align-items-center justify-content-between ">
                  <p className="text-input">{phone}</p>
                  <button className="btn-change" onClick={inputPhone}>
                    <i className="fas fa-pencil-alt"></i> Thay đổi
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between ">
                  <input
                    type="text"
                    id="phone"
                    placeholder="Nhập Số Điện Thoại"
                    name="phone"
                    value={newPhone}
                    onChange={handlePhoneChange}
                    className="form-control w-50 border"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    required
                  />
                  <button className="btn-cancel" onClick={cancelChangePhone}>
                    <i className="fas fa-times p-1"></i>Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row g-3 align-items-center">
            <div className="col-3">
              <label for="email" className="col-form-label font-weight-bold">
                Email:
              </label>
            </div>
            <div className="col-9">
              {email && isEmail ? (
                <div className="d-flex align-items-center justify-content-between ">
                  <p className="text-input">{email}</p>
                  <button className="btn-change" onClick={inputEmail}>
                    <i className="fas fa-pencil-alt"></i> Thay đổi
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between ">
                  <input
                    type="email"
                    placeholder="Nhập Email"
                    id="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                    name="email"
                    className="form-control w-50 border "
                  />
                  <button className="btn-cancel " onClick={cancelChangeEmail}>
                    <i className="fas fa-times p-1"></i>Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row g-3 align-items-center">
            <div className="col-3 font-weight-bold">
              <label for="pwd">Địa chỉ:</label>
            </div>
            <div className="col-9">
              {address && isAddress ? (
                <div className="d-flex align-items-center justify-content-between ">
                  <p className="text-input">{address}</p>
                  <button className="btn-change" onClick={inputAddress}>
                    <i className="fas fa-pencil-alt"></i> Thay đổi
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    type="adress"
                    placeholder="Nhập Địa Chỉ"
                    id="pwd"
                    value={newAddress}
                    onChange={handlenewAddress}
                    name="pwd"
                    className="form-control w-50 border "
                  />
                  <button className="btn-cancel " onClick={cancelChangeAddress}>
                    <i className="fas fa-times p-1"></i>Hủy
                  </button>
                </div>
              )}

              <br />
            </div>
          </div>

          <div className="w-70 d-flex justify-content-center mb-3">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-25 text-white"
              onClick={handleSubmitForm}
            >
              <span>Cập nhật</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUser;

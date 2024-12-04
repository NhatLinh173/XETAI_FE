import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdDirectionsCar } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { FaChartLine } from "react-icons/fa6";
import { BsFileEarmarkPost } from "react-icons/bs";
import useAuth from "../../../hooks/useAuth";

const Tab = ({ tab1, setTab1 }) => {
  const [role, setRole] = useState("");
  const { handleLogout } = useAuth();
  const handleLogoutClick = async () => {
    await handleLogout();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      setRole(userRole);
    }
  }, []);

  const handleClickProfile = () => {
    setTab1("profile");
    localStorage.setItem("tabHistory", "profile");
  };
  const handleClickPost = () => {
    setTab1("historyPost");
    localStorage.setItem("tabHistory", "historyPost");
  };
  const handleClickHistoryPostDriver = () => {
    setTab1("historyPostDriver");
    localStorage.setItem("tabHistory", "historyPostDriver");
  };
  const handleClickFarvoriteDriver = () => {
    setTab1("favoriteDriver");
    localStorage.setItem("tabHistory", "favoriteDriver");
  };
  const handleClickChangePassword = () => {
    setTab1("changePassword");
    localStorage.setItem("tabHistory", "changePassword");
  };
  const handleClickTripHistory = () => {
    setTab1("tripHistory");
    localStorage.setItem("tabHistory", "tripHistory");
  };
  const handleClickWallet = () => {
    setTab1("wallet");
    localStorage.setItem("tabHistory", "wallet");
  };
  const handleClickVehicals = () => {
    setTab1("vehicals");
    localStorage.setItem("tabHistory", "vehicals");
  };

  const handleClickStatistical = () => {
    setTab1("statistical");
    localStorage.setItem("tabHistory", "statistical");
  };

  return (
    <div className="d-flex flex-column h-100">
      <h2>Tài Khoản</h2>
      <div className="mt-3">
        <ul>
          <li className="tab-item">
            <button
              className={`btn-tab d-flex align-items-center ${tab1 === "profile" ? "active" : ""
                }`}
              onClick={handleClickProfile}
            >
              <CgProfile />
              <span className="px-2 ">Tài khoản</span>
            </button>
          </li>
          <li className="my-3 ">
            <button
              className={`btn-tab d-flex align-items-center ${tab1 === "historyPost" ? "active" : ""
                }`}
              onClick={handleClickPost}
            >
              <PiPackage />
              <span className="px-2">Đơn hàng</span>
            </button>
          </li>
          {(role === "personal" || role === "business") && (
            <li className="my-3">
              <button
                className={`btn-tab d-flex align-items-center ${tab1 === "historyPostDriver" ? "active" : ""}`}
                onClick={handleClickHistoryPostDriver}
              >
                <BsFileEarmarkPost />
                <span className="px-2">Bài Đăng</span>
              </button>
            </li>
          )}
          {role === "customer" && (
            <li className="tab-item">
              <button
                className={`btn-tab d-flex align-items-center ${tab1 === "favoriteDriver" ? "active" : ""
                  }`}
                onClick={handleClickFarvoriteDriver}
              >
                <FaRegHeart />
                <span className="px-2 ">Tài xế yêu thích</span>
              </button>
            </li>
          )}
          <li className="my-3">
            <button
              className={`btn-tab d-flex align-items-center ${tab1 === "changePassword" ? "active" : ""}`}
              onClick={handleClickChangePassword}
            >
              <RiLockPasswordLine />
              <span className="px-2">Mật khẩu</span>
            </button>
          </li>
          <li className="my-3">
            <button
              className={`btn-tab d-flex align-items-center ${tab1 === "tripHistory" ? "active" : ""
                }`}
              onClick={handleClickTripHistory}
            >
              <MdAccessTime />
              <span className="px-2">
                {role === "personal" || role === "business"
                  ? "Lịch sử chuyến"
                  : "Đơn hoàn thành"}
              </span>
            </button>
          </li>
          <li className="my-3">
            <button
              className={`btn-tab d-flex align-items-center ${tab1 === "wallet" ? "active" : ""}`}
              onClick={handleClickWallet}
            >
              <LuWallet />
              <span className="px-2">Ví của bạn</span>
            </button>
          </li>

          {(role === "personal" || role === "business") && (
            <li className="my-3">
              <button
                className={`btn-tab d-flex align-items-center ${tab1 === "vehicals" ? "active" : ""}`}
                onClick={handleClickVehicals}
              >
                <MdDirectionsCar />
                <span className="px-2">Xe của tôi</span>
              </button>
            </li>
          )}
          {(role === "personal" || role === "business") && (
            <li className="my-3">
              <button
                className={`btn-tab d-flex align-items-center ${tab1 === "statistical" ? "active" : ""}`}
                onClick={handleClickStatistical}
              >
                <FaChartLine />
                <span className="px-2">Thống Kê </span>
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="my-4">
        <button
          className="btn btn-theme btn-lg d-flex align-items-center"
          onClick={handleLogoutClick}
        >
          <FaArrowRightFromBracket />
          <span className="px-1">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Tab;

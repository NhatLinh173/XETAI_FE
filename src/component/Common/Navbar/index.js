import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../../../assets/img/RFTMS_logo_12.png";
import TopHeader from "../TopHeader";
import { getMenuData } from "./MenuData";
import MenuItems from "./MenuItems";
import SearchForm from "../SearchForm";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaArrowRightFromBracket, FaBell } from "react-icons/fa6";
import useAuth from "../../../hooks/useAuth";
import useUserData from "../../../hooks/useUserData";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
import { IoMdNotifications } from "react-icons/io";
import { io } from "socket.io-client";
import axios from "axios";

const Navbar = ({ openModal }) => {
  const { handleLogout, isAuthenticated } = useAuth();
  const { userData, loading } = useUserData();
  const [click, setClick] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const socket = io("wss://xetai-be.vercel.app", {
      withCredentials: true,
    });

    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("joinRoom", userId);
    }

    socket.on("receiveNotification", (notification) => {
      const { title, message, data } = notification;
      const { postId, status } = data;

      setNotifications((prev) => [{ title, message, postId, status }, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://https://xetai-be.vercel.app/notifications/${localStorage.getItem(
            "userId"
          )}`
        );
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (userData && userData.avatar) {
      localStorage.setItem("avatar", userData.avatar);
      setAvatar(userData.avatar);
    } else {
      setAvatar(avatarDefault);
    }
  }, [userData]);

  useEffect(() => {
    const checkToken = localStorage.getItem("accessToken");
    if (checkToken) {
      setIsLoggedIn(true);
      const avatarFromLocalStorage = localStorage.getItem("avatar");
      if (avatarFromLocalStorage) {
        setAvatar(avatarFromLocalStorage);
      } else {
        setAvatar(avatarDefault);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      const avatarFromLocalStorage = localStorage.getItem("avatar");
      setAvatar(avatarFromLocalStorage);
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target) &&
        e.target.id !== "notification-icon" // Đảm bảo không đóng khi click vào icon
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.title === "Tin nhắn mới") {
      history.push(`/chat`);
    } else if (notification.title === "Đơn hàng") {
      history.push(`/order/${notification.postId}`);
    }
  };

  const isSticky = () => {
    const header = document.querySelector(".navbar-area");
    if (header) {
      const scrollTop = window.scrollY;
      scrollTop >= 250
        ? header.classList.add("is-sticky")
        : header.classList.remove("is-sticky");
    } else {
      return;
    }
  };

  const handleClick = () => {
    if (click) {
      document
        .querySelector("#navbarSupportedContent")
        .classList.remove("navber-colpes");
    } else {
      document
        .querySelector("#navbarSupportedContent")
        .classList.add("navber-colpes");
    }
    setClick(!click);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  const menuData = getMenuData();

  return (
    <>
      <header className="header-area">
        <TopHeader />
        <div className="navbar-area">
          <div className="transTics-nav">
            <div className="container">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link className="navbar-brand" to="/">
                  <img src={logo} alt="logo" />
                </Link>

                <div className="mean-menu" id="navbarSupportedContent">
                  <ul className="navbar-nav">
                    {menuData.map((item, index) => (
                      <MenuItems
                        item={item}
                        key={index}
                        openModal={openModal}
                      />
                    ))}
                    <div
                      className="notification-icon"
                      style={{ position: "relative" }}
                    >
                      <IoMdNotifications
                        id="notification-icon"
                        size={24}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                          setShowNotifications((prev) => !prev); // Đảo trạng thái hiển thị thông báo
                          setUnreadCount(0); // Reset đếm số thông báo chưa đọc
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      {unreadCount > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-10px",
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px 6px",
                            fontSize: "12px",
                          }}
                        >
                          {unreadCount}
                        </span>
                      )}
                      {showNotifications && (
                        <div
                          ref={notificationRef}
                          style={{
                            position: "absolute",
                            top: "30px",
                            right: "0",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            zIndex: 1000,
                            width: "300px",
                            maxHeight: "400px",
                            overflowY: "auto",
                          }}
                        >
                          <h5 className="p-2 border-bottom">Thông báo</h5>
                          <ul
                            style={{
                              listStyle: "none",
                              padding: "0",
                              margin: "0",
                            }}
                          >
                            {notifications.map((notif, index) => (
                              <li
                                key={index}
                                className="p-2 border-bottom"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleNotificationClick(notif)}
                              >
                                <strong>{notif.title}</strong>: {notif.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {isAuthenticated && userData && (
                      <div className="nav-avatar rounded-circle ml-4">
                        <a href="/profile">
                          <img
                            className="rounded-circle"
                            src={avatar || avatarDefault}
                            alt="avatar"
                            onError={(e) => {
                              e.target.src = avatarDefault;
                            }}
                          />
                        </a>
                        <div
                          className="nav-avatar-item"
                          style={{ width: "220px" }}
                        >
                          <div className="p-3 ">
                            <div>
                              <Link
                                to="/profile"
                                className="d-flex align-items-center nav-text"
                              >
                                <CgProfile />
                                <span
                                  className="pl-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  Xem Thông Tin
                                </span>
                              </Link>
                            </div>
                            <div className="py-2">
                              <a
                                onClick={handleLogoutClick}
                                className="d-flex align-items-center nav-text"
                              >
                                <FaArrowRightFromBracket />
                                <span
                                  className="pl-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  Đăng xuất
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
          <div className="transtics-responsive-nav">
            <div className="container">
              <div className="responsive-button" onClick={handleClick}>
                {click ? <AiOutlineClose /> : <HiMenuAlt3 />}
              </div>
            </div>
          </div>
        </div>
      </header>
      <SearchForm />
    </>
  );
};

export default Navbar;

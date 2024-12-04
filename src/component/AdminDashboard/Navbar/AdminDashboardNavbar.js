import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import useUserData from "../../../hooks/useUserData";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";

function AdminDashboardNavbar() {
  const { userData, loading } = useUserData();
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName);
      if (userData.avatar) {
        localStorage.setItem("avatar", userData.avatar);
        setAvatar(userData.avatar);
      } else {
        setAvatar(avatarDefault);
      }
    }
  }, [userData]);

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="mb-4 admin-dashboard-navbar"
    >
      <Navbar.Brand href="#home" className="admin-dashboard-navbar-brand">
        <span className="brand-icon">&#9733;</span>
        Admin Dashboard
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto admin-dashboard-navbar-nav"></Nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "20px",
          }}
        >
          <img
            src={avatar || avatarDefault}
            alt="Admin Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
          <span style={{ color: "white", fontWeight: "bold" }}>{fullName}</span>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AdminDashboardNavbar;

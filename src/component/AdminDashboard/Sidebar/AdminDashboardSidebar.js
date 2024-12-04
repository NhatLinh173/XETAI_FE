import React, { useState } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaUserTie,
  FaClipboardList,
  FaChartLine,
  FaNewspaper,
  FaFileSignature,
  FaUserCircle,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { PiHandWithdrawBold } from "react-icons/pi";
import useAuth from "../../../hooks/useAuth";
function AdminDashboardSidebar({ setActiveSection, activeSection }) {
  const { handleLogout, isAuthenticated } = useAuth();
  const [isReportsExpanded, setIsReportsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const handleLogoutClick = async () => {
    await handleLogout();
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <Button
        variant="primary"
        className="d-lg-none mb-3"
        onClick={toggleSidebar}
      >
        Menu
      </Button>

      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        className="d-lg-none"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Điều hướng</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent
            setActiveSection={setActiveSection}
            activeSection={activeSection}
            isReportsExpanded={isReportsExpanded}
            setIsReportsExpanded={setIsReportsExpanded}
            handleLogoutClick={handleLogoutClick}
            userRole={userRole}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar for Larger Screens */}
      <Nav className="flex-column admin-dashboard-sidebar d-none d-lg-flex">
        <SidebarContent
          setActiveSection={setActiveSection}
          activeSection={activeSection}
          isReportsExpanded={isReportsExpanded}
          setIsReportsExpanded={setIsReportsExpanded}
          handleLogoutClick={handleLogoutClick}
          userRole={userRole}
        />
      </Nav>
    </>
  );
}

function SidebarContent({
  setActiveSection,
  activeSection,
  isReportsExpanded,
  setIsReportsExpanded,
  handleLogoutClick,
  userRole,
}) {
  return (
    <>
      <h2 className="sidebar-title text-uppercase fw-bold">Điều hướng</h2>
      <Nav.Link
        onClick={() => {
          setActiveSection("dashboard");
          localStorage.setItem("tabAdmin", "dashboard");
        }}
        className={`sidebar-link ${
          activeSection === "dashboard" ? "active" : ""
        }`}
      >
        <FaTachometerAlt className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Trang chủ</div>
      </Nav.Link>
      <hr className="admin-sidebar-divider" />
      <h2 className="sidebar-title text-uppercase fw-bold">
        Quản lý tài khoản
      </h2>
      <Nav.Link
        onClick={() => {
          setActiveSection("customers");
          localStorage.setItem("tabAdmin", "customers");
        }}
        className={`sidebar-link ${
          activeSection === "customers" ? "active" : ""
        }`}
      >
        <FaUsers className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Quản lý khách hàng</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("drivers");
          localStorage.setItem("tabAdmin", "drivers");
        }}
        className={`sidebar-link ${
          activeSection === "drivers" ? "active" : ""
        }`}
      >
        <FaCar className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Quản lý tài xế</div>
      </Nav.Link>
      {userRole !== "staff" && (
        <Nav.Link
          onClick={() => setActiveSection("staff")}
          className={`sidebar-link ${
            activeSection === "staff" ? "active" : ""
          }`}
        >
          <FaUserTie className="admin-dashboard-sidebar-icon" />
          <div className="sidebar-title">Quản lý nhân viên</div>
        </Nav.Link>
      )}
      <hr className="admin-sidebar-divider" />
      <h2 className="sidebar-title text-uppercase fw-bold">Quản lý hệ thống</h2>
      <Nav.Link
        onClick={() => {
          setIsReportsExpanded(!isReportsExpanded);
        }}
        className={`sidebar-link ${
          activeSection === "reports" ||
          activeSection === "posts-report" ||
          activeSection === "orders-report"
            ? "active"
            : ""
        }`}
      >
        <FaChartLine className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Quản lý báo cáo</div>
      </Nav.Link>
      {isReportsExpanded && (
        <div className="sidebar-submenu">
          <Nav.Link
            onClick={() => {
              setActiveSection("posts-report"); // Cập nhật activeSection khi chọn Báo cáo bài đăng
              localStorage.setItem("tabAdmin", "posts-report");
            }}
            className={`sidebar-link ${
              activeSection === "posts-report" ? "active" : ""
            }`}
            style={{ fontWeight: "bold", paddingLeft: "60px" }}
          >
            Báo cáo bài đăng
          </Nav.Link>
          <Nav.Link
            onClick={() => {
              setActiveSection("orders-report"); // Cập nhật activeSection khi chọn Báo cáo đơn hàng
              localStorage.setItem("tabAdmin", "orders-report");
            }}
            className={`sidebar-link ${
              activeSection === "orders-report" ? "active" : ""
            }`}
            style={{ fontWeight: "bold", paddingLeft: "60px" }}
          >
            Báo cáo đơn hàng
          </Nav.Link>
        </div>
      )}
      <Nav.Link
        onClick={() => {
          setActiveSection("news");
          localStorage.setItem("tabAdmin", "news");
        }}
        className={`sidebar-link ${activeSection === "news" ? "active" : ""}`}
      >
        <FaNewspaper className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Quản lý tin tức</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("confirm-withdraw");
          localStorage.setItem("tabAdmin", "confirm-withdraw");
        }}
        className={`sidebar-link ${
          activeSection === "confirm-withdraw" ? "active" : ""
        }`}
      >
        <PiHandWithdrawBold className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Xác nhận rút tiền</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("transaction-system");
          localStorage.setItem("tabAdmin", "transaction-system");
        }}
        className={`sidebar-link ${
          activeSection === "transaction-system" ? "active" : ""
        }`}
      >
        <GrTransaction className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Lịch sử giao dịch của hệ thống</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("vehicles");
          localStorage.setItem("tabAdmin", "vehicles");
        }}
        className={`sidebar-link ${
          activeSection === "vehicles" ? "active" : ""
        }`}
      >
        <FaFileSignature className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Quản lý đăng ký xe</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("chat");
          localStorage.setItem("tabAdmin", "chat");
        }}
        className={`sidebar-link ${activeSection === "chat" ? "active" : ""}`}
      >
        <FaMessage className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Hỗ trợ khách hàng</div>
      </Nav.Link>
      <hr className="admin-sidebar-divider" />
      <h2 className="sidebar-title text-uppercase fw-bold">
        Thông tin cá nhân
      </h2>
      <Nav.Link
        onClick={() => {
          setActiveSection("admin-profile");
          localStorage.setItem("tabAdmin", "AdminProfile");
        }}
        className={`sidebar-link ${
          activeSection === "admin-profile" ? "active" : ""
        }`}
      >
        <FaUserCircle className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Thông tin cá nhân</div>
      </Nav.Link>
      <Nav.Link
        onClick={() => {
          setActiveSection("admin-changePassword");
          localStorage.setItem("tabAdmin", "AdminChangePassword");
        }}
        className={`sidebar-link ${
          activeSection === "admin-changePassword" ? "active" : ""
        }`}
      >
        <FaKey className="admin-dashboard-sidebar-icon" />
        <div className="sidebar-title">Đổi mật khẩu</div>
      </Nav.Link>
      <hr className="admin-sidebar-divider" />
      <div className="logout-section mt-1">
        <Nav.Link onClick={handleLogoutClick} className={`sidebar-link`}>
          <FaSignOutAlt className="admin-dashboard-sidebar-icon" />
          <div className="sidebar-title">Đăng xuất</div>
        </Nav.Link>
      </div>
    </>
  );
}

export default AdminDashboardSidebar;

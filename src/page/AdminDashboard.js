import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminDashboardNavbar from "../component/AdminDashboard/Navbar/AdminDashboardNavbar";
import AdminDashboardSidebar from "../component/AdminDashboard/Sidebar/AdminDashboardSidebar";
import DashboardHome from "../component/AdminDashboard/DashboardHome/DashboardHome";
import DriverManagement from "../component/AdminDashboard/DriverManagement/DriverManagement";
import CustomerManagement from "../component/AdminDashboard/CustomerManagement/CustomerManagement";
import StaffManagement from "../component/AdminDashboard/StaffManagement/StaffManagement";
import OrderReport from "../component/AdminDashboard/ReportManagement/OrderReport";
import NewsManagement from "../component/AdminDashboard/NewsManagement/NewManagement";
import AdminProfile from "../component/AdminDashboard/AdminProfile/AdminProfile";
import PostReport from "../component/AdminDashboard/ReportManagement/PostReport";
import VehicleManager from "../component/AdminDashboard/VehicleManagement/vehicleManagement";
import StaffChangePassword from "../component/AdminDashboard/AdminProfile/StaffChangePassword.js";
import ConfirmWithDraw from "../component/AdminDashboard/ConfirmWithDraw/confirmWithDraw";
import TransactionSystem from "../component/AdminDashboard/TransactionSystem/transactionSystem.js";
import ChatAdmin from "../component/AdminDashboard/Chat/chatAdmin.js";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("tabAdmin") || "dashboard"
  );

  useEffect(() => {
    const handleClassAssignment = () => {
      const element = document.querySelector(".sticky-element");
      if (element) {
        element.classList.add(`${activeSection}Admin`);
      } else {
        console.warn("sticky-element not found in the DOM");
      }
    };

    const timeout = setTimeout(handleClassAssignment, 0);

    return () => clearTimeout(timeout);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem("tabAdmin", activeSection);
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome />;
      case "drivers":
        return <DriverManagement />;
      case "customers":
        return <CustomerManagement />;
      case "staff":
        return <StaffManagement />;
      case "orders-report":
        return <OrderReport />;
      case "posts-report":
        return <PostReport />;
      case "news":
        return <NewsManagement />;
      case "admin-profile":
        return <AdminProfile />;
      case "admin-changePassword":
        return <StaffChangePassword />;
      case "vehicles":
        return <VehicleManager />;
      case "confirm-withdraw":
        return <ConfirmWithDraw />;
      case "transaction-system":
        return <TransactionSystem />;
      case "chat":
        return <ChatAdmin />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminDashboardNavbar />
      <Container fluid>
        <Row>
          <Col md={2}>
            <AdminDashboardSidebar
              setActiveSection={setActiveSection}
              activeSection={activeSection} // Truyền activeSection vào Sidebar
            />
          </Col>
          <Col md={10} className="admin-dashboard-content">
            <div className="sticky-element">
              {renderContent()} {/* Render nội dung dựa trên activeSection */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;

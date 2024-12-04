import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBoxOpen, FaWeightHanging } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";

const ServiceCard = ({
  id,
  img,
  title,
  pickupLocation,
  dropoffLocation,
  weight,
  price,
}) => {
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const userId = localStorage.getItem("userId");

  const handleThreeDotsClick = () => setShowReportButton(!showReportButton);
  const handleReportClick = () => setShowReportModal(true);
  const handleCloseModal = () => {
    setShowReportModal(false);
    setShowReportButton(false);
  };

  const handleConfirmReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/report", {
        reporterId: userId,
        postId: id,
        description: reportReason,
      });
      if (response.status === 201) {
        toast.success("Báo cáo đơn hàng thành công!!");
        setReportReason("");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!!!!");
    }
    setShowReportModal(false);
    setShowReportButton(false);
  };

  return (
    <div className="service-card position-relative">
      <img src={img} alt={title} className="service-card-image zoom-image" />

      {/* Three-dot icon */}
      <div
        className="position-absolute"
        style={{
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={handleThreeDotsClick}
        title="Báo cáo bài đăng"
      >
        <span style={{ color: "#fff", fontSize: "20px", lineHeight: "0" }}>
          •••
        </span>
      </div>

      {/* Report Button */}
      {showReportButton && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            zIndex: 10,
            backgroundColor: "#fff",
            padding: "5px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            className="btn btn-danger btn-sm"
            onClick={handleReportClick}
            style={{ width: "100%" }}
          >
            Báo cáo
          </button>
        </div>
      )}

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Báo cáo đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <textarea
              id="reportReason"
              className="custom-textarea text-decoration-none "
              rows="4"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do của bạn..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmReport}>
            Báo cáo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ServiceCard content */}
      <div className="mb-2 text-secondary d-flex align-items-center m-2">
        <FaMapMarkerAlt className="mr-2" />
        <div className="font-weight-bold text-nowrap">Địa điểm đi:</div>
        <div className="w-75 ml-2 text-truncate">{pickupLocation}</div>
      </div>
      <div className="mb-2 text-secondary d-flex align-items-center m-2">
        <FaMapMarkerAlt className="mr-2" />
        <div className="font-weight-bold text-nowrap">Địa điểm đến:</div>
        <div className="w-75 ml-2 text-truncate">{dropoffLocation}</div>
      </div>
      <div className="mb-2 text-secondary d-flex align-items-center m-2">
        <FaBoxOpen className="mr-2" />
        <div className="font-weight-bold text-nowrap">Loại hàng:</div>
        <div className="w-75 ml-2 text-truncate">{title}</div>
      </div>
      <div className="mb-2 text-secondary d-flex align-items-center m-2">
        <FaWeightHanging className="mr-2" />
        <div className="font-weight-bold text-nowrap">Khối lượng:</div>
        <div className="w-75 ml-2 text-truncate">{weight} kg</div>
      </div>
      <div className="mb-2 text-secondary d-flex align-items-center m-2">
        <RiMoneyDollarCircleFill className="mr-2" />
        <div className="font-weight-bold text-nowrap">Giá:</div>
        <div className="w-75 ml-2 text-truncate">{price} VND</div>
      </div>
      <Link to={`/order/${id}`} className="btn btn-theme w-100">
        Xem chi tiết
      </Link>
    </div>
  );
};

export default ServiceCard;

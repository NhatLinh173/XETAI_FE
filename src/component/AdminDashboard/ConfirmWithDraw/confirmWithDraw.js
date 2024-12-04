import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const WithdrawRequests = () => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchWithdrawRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3005/payment/all/withdraw"
      );
      setWithdrawRequests(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      alert("Không thể tải danh sách yêu cầu rút tiền.");
    }
  };

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const displayRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3005/payment/withdraw/${id}/process`
      );
      if (response.status === 200) {
        setWithdrawRequests(response.data);
        setShowModal(false);
        await fetchWithdrawRequests();
      }
    } catch (error) {
      console.error("Lỗi xử lý yêu cầu:", error);
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
      } else {
        console.error("Lỗi khác:", error.message);
      }
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/payment/withdraw/${id}/reject`
      );
      if (response.status === 200) {
        setShowModal(false);
        await fetchWithdrawRequests();
      }
    } catch (error) {
      console.error("Lỗi xử lý yêu cầu:", error);
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
      } else {
        console.error("Lỗi khác:", error.message);
      }
    }
  };

  return (
    <div className=" Withdraw-requests_container mt-5">
      <h3 className="mb-4 text-center display-4 font-weight-bold">
        Danh sách yêu cầu rút tiền
      </h3>
      <table className="table table-hover shadow-sm">
        <thead className="thead-light">
          <tr>
            <th>STT</th>
            <th>Người yêu cầu</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {withdrawRequests.length > 0 ? (
            withdrawRequests.map((request, index) => (
              <tr
                key={request._id}
                onClick={() => displayRequestDetails(request)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>{request.userId.fullName}</td>
                <td>{request.amount.toLocaleString()} VND</td>
                <td>
                  {request.status === "PENDING"
                    ? "Chờ xử lý"
                    : request.status === "ACCEPTED"
                    ? "Đã chấp nhận"
                    : request.status === "REJECTED"
                    ? "Đã từ chối"
                    : request.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có yêu cầu rút tiền nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết */}
      {selectedRequest && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết yêu cầu</Modal.Title>
          </Modal.Header>
          <Modal.Body className="withdraw-modal-details">
            <div className="withdraw-modal-row">
              <strong className="withdraw-modal-label">Số tiền cần rút:</strong>
              <span className="withdraw-modal-value">
                {selectedRequest.amount.toLocaleString()} VND
              </span>
            </div>
            <div className="withdraw-modal-row">
              <strong className="withdraw-modal-label">Tên ngân hàng:</strong>
              <span className="withdraw-modal-value">
                {selectedRequest.bankName}
              </span>
            </div>
            <div className="withdraw-modal-row">
              <strong className="withdraw-modal-label">
                Tên chủ tài khoản:
              </strong>
              <span className="withdraw-modal-value">
                {selectedRequest.accountHolderName}
              </span>
            </div>
            <div className="withdraw-modal-row">
              <strong className="withdraw-modal-label">Số tài khoản:</strong>
              <span className="withdraw-modal-value">
                {selectedRequest.accountNumber}
              </span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => handleReject(selectedRequest._id, "reject")}
            >
              Từ chối
            </Button>
            <Button
              variant="success"
              onClick={() => handleRequest(selectedRequest._id, "accept")}
            >
              Chấp nhận
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default WithdrawRequests;

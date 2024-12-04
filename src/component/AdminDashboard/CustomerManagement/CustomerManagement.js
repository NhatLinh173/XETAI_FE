import React, { useEffect, useState } from "react";
import { Table, Form, Modal, Button } from "react-bootstrap";
import { FaLock, FaUnlock, FaSortUp, FaSortDown } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import useInstanceData from "../../../config/useInstanceData";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../../../config/axiosConfig";

const CustomerManagement = () => {
  const { data: customer } = useInstanceData("auth/users/customer");
  console.log(customer);

  const [customers, setCustomers] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lockDuration, setLockDuration] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [customersPerPage, setCustomersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  useEffect(() => {
    if (customer) {
      setCustomers(customer);
    } else {
      toast.error("User not found!");
    }
  }, [customer]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.phone &&
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("alo: ", filteredCustomers);

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const displayedCustomers = sortedCustomers.slice(
    currentPage * customersPerPage,
    (currentPage + 1) * customersPerPage
  );

  const toggleCustomerStatus = (id) => {
    const customer = customers.find((customer) => customer._id === id);
    if (customer.isBlocked) {
      unlockDriverAccount(id);
    } else {
      setSelectedCustomer(id);
      setShowModal(true);
    }
  };

  const lockUserAccount = async (id, duration) => {
    try {
      const response = await axios.put(
        `https://xetai-be.vercel.app/auth/user/${id}/block`,
        {
          duration: duration,
        }
      );

      if (response.status === 200) {
        setCustomers(
          customers.map((customer) =>
            customer._id === id ? { ...customer, isBlocked: true } : customer
          )
        );
        toast.success("Người dùng đã bị khóa thành công");
        setShowModal(false);
        setLockDuration("");
        setSelectedCustomer(null);
      }
    } catch (error) {}
  };

  const handleLock = () => {
    if (selectedCustomer) {
      lockUserAccount(selectedCustomer, lockDuration);
    }
  };

  const unlockDriverAccount = async (id) => {
    try {
      const response = await axios.put(
        `https://xetai-be.vercel.app/auth/user/${id}/unlock`
      );
      if (response.status === 200) {
        setCustomers(
          customers.map((customer) =>
            customer._id === id ? { ...customer, isBlocked: false } : customer
          )
        );
        toast.success("Người dùng đã được mở khóa");
      } else {
        console.error("Error unlocking driver account:", response.statusText);
      }
    } catch (error) {
      console.error("Error unlocking driver account:", error);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const openTransactionModal = async (id) => {
    const customer = customers.find((customer) => customer._id === id);
    const response = await axiosInstance.get(
      `/auth/transaction/${customer._id}`
    );
    setTransaction(response.data.transactions);
    setSelectedCustomer(customer);
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedCustomer(null);
  };

  const getDescription = (type) => {
    switch (type) {
      case "POST_PAYMENT":
        return "Trả phí đăng bài";
      case "DEPOSIT":
        return "Nạp tiền";
      case "CANCEL_ORDER":
        return "Hủy Nhận chuyến";
      default:
        return "Không xác định";
    }
  };
  const getStatus = (status) => {
    switch (status) {
      case "PAID":
        return "Thành công";
      case "PENDING":
        return "Đang chờ xử lý";
      case "FAILED":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };
  return (
    <div className="customer-management-container mt-5">
      <h2 className="customer-management-title mb-4 text-center">
        Quản Lý Khách Hàng
      </h2>

      <Form className="customer-management-search-form mb-4">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="customer-management-search-input"
          />
        </Form.Group>
      </Form>

      <div className="mb-3 d-flex justify-content-end">
        <Form.Select
          aria-label="Chọn số lượng khách hàng mỗi trang"
          value={customersPerPage}
          onChange={(e) => {
            setCustomersPerPage(parseInt(e.target.value));
            setCurrentPage(0);
          }}
          style={{ width: "200px" }}
        >
          <option value="5">5 khách hàng</option>
          <option value="10">10 khách hàng</option>
          <option value="20">20 khách hàng</option>
          <option value="50">50 khách hàng</option>
        </Form.Select>
      </div>

      <Table striped bordered hover className="customer-management-table mt-3">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Đơn đã hoàn thành</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedCustomers.map((customer) => (
            <tr key={customer._id}>
              <td style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={customer.avatar}
                  alt={customer.fullName}
                  className="customer-management-avatar"
                />
                {customer.fullName || ""}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "38px",
                }}
              >
                {customer.phone}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "38px",
                }}
              >
                {customer.address || ""}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "38px",
                }}
              >
                {customer.postCount || 0}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "38px",
                }}
              >
                {customer.isBlocked ? (
                  <FaLock
                    className="customer-management-status-icon text-danger"
                    onClick={() => toggleCustomerStatus(customer._id)}
                  />
                ) : (
                  <FaUnlock
                    className="customer-management-status-icon text-success"
                    onClick={() => toggleCustomerStatus(customer._id)}
                  />
                )}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                <Button
                  variant="info"
                  onClick={() => openTransactionModal(customer._id)}
                  style={{ fontSize: "15px" }}
                >
                  Lịch sử giao dịch
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="customer-management-pagination-controls text-center">
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          breakLabel={"..."}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          pageCount={Math.ceil(filteredCustomers.length / customersPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>

      <Modal
        show={showTransactionModal}
        onHide={closeTransactionModal}
        centered
        className="customer-transaction-modal bg-dark bg-opacity-75"
      >
        <Modal.Header closeButton>
          <Modal.Title>Lịch Sử Giao Dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transaction.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Loại giao dịch</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {transaction.map((tran) => (
                  <tr key={tran._id}>
                    <td>{getDescription(tran.type)}</td>
                    <td>{tran.amount}</td>
                    <td>{getStatus(tran.status)}</td>
                    <td>
                      {new Date(tran.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Không có giao dịch nào</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTransactionModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="driver-lock-modal"
      >
        <Modal.Header closeButton className="driver-lock-modal-header">
          <Modal.Title>Khóa Tài Xế</Modal.Title>
        </Modal.Header>
        <Modal.Body className="driver-lock-modal-body">
          <h5 className="text-center mb-4">Chọn thời gian khóa:</h5>
          <Form.Group>
            <Form.Check
              type="radio"
              label="1 Ngày"
              name="lockDuration"
              value="1day"
              checked={lockDuration === "1day"}
              onChange={(e) => setLockDuration(e.target.value)}
              className="driver-lock-modal-radio mb-2"
              custom
            />
            <Form.Check
              type="radio"
              label="3 Ngày"
              name="lockDuration"
              value="3days"
              checked={lockDuration === "3days"}
              onChange={(e) => setLockDuration(e.target.value)}
              className="driver-lock-modal-radio mb-2"
              custom
            />
            <Form.Check
              type="radio"
              label="Vĩnh Viễn"
              name="lockDuration"
              value="forever"
              checked={lockDuration === "forever"}
              onChange={(e) => setLockDuration(e.target.value)}
              className="driver-lock-modal-radio mb-2"
              custom
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="driver-lock-modal-footer">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleLock}
            disabled={!lockDuration}
          >
            Khóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerManagement;

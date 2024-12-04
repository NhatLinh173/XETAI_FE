import React, { useState, useEffect } from "react";
import { Table, Form, Modal, Button } from "react-bootstrap";
import { FaLock, FaUnlock, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
import axiosInstance from "../../../config/axiosConfig";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffPerPage, setStaffPerPage] = useState(10);
  const [newStaff, setNewStaff] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axiosInstance.get("/auth/users/getAllStaff");
        setStaff(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staff.filter((member) =>
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStaff = filteredStaff.slice(
    currentPage * staffPerPage,
    (currentPage + 1) * staffPerPage
  );

  const handleLock = async (id) => {
    try {
      const response = await axiosInstance.put(`/auth/user/${id}/block`, {
        duration: "forever",
      });
      if (response.status === 200) {
        setStaff((prev) =>
          prev.map((member) =>
            member._id === id ? { ...member, isBlocked: true } : member
          )
        );
        toast.success("Tài khoản đã bị khóa");
      } else {
        toast.error("Lỗi khi khóa tài khoản này");
      }
    } catch (error) {
      console.error("Error blocking staff account: " + error.message);
    }
  };

  const handleUnlock = async (id) => {
    try {
      const response = await axiosInstance.put(`/auth/user/${id}/unlock`);
      if (response.status === 200) {
        setStaff((prev) =>
          prev.map((member) =>
            member._id === id ? { ...member, isBlocked: false } : member
          )
        );
        toast.success("Tài khoản đã được mở khóa");
      } else {
        toast.error("Lỗi khi mở khóa tài khoản này");
      }
    } catch (error) {
      console.error("Error unblocking staff account: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // New function to handle form submission
  const handleAddStaff = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Kiểm tra tính hợp lệ của form
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Tạo đối tượng nhân viên mới từ form
    const newStaffMember = {
      fullName: newStaff.fullName,
      email: newStaff.email,
    };

    try {
      const response = await axiosInstance.post(
        "/auth/users/add-staff",
        newStaffMember
      );

      if (response.status === 201) {
        setStaff((prev) => [...prev, response.data]);
        setShowAddModal(false);
        setNewStaff({
          fullName: "",
          email: "",
          avatar: avatarDefault,
        });
        setValidated(false);
        toast.success("Thêm nhân viên mới thành công");
      } else {
        toast.error("Có lỗi xảy ra khi thêm nhân viên");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm nhân viên: " + error.message);
    }
  };

  return (
    <div className="staff-management-container mt-5">
      <h2 className="staff-management-title mb-4 text-center">
        Quản Lý Nhân Viên
      </h2>

      <div className="d-flex justify-content-between mb-4">
        <Form className="staff-management-search-form">
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="staff-management-search-input"
            />
          </Form.Group>
        </Form>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center"
        >
          <FaUserPlus className="me-2" />
          Thêm Nhân Viên
        </Button>
      </div>

      <div className="mb-3 d-flex justify-content-end">
        <Form.Select
          aria-label="Chọn số lượng nhân viên mỗi trang"
          value={staffPerPage}
          onChange={(e) => {
            setStaffPerPage(parseInt(e.target.value));
            setCurrentPage(0);
          }}
          style={{ width: "200px" }}
        >
          <option value="5">5 nhân viên</option>
          <option value="10">10 nhân viên</option>
          <option value="20">20 nhân viên</option>
          <option value="50">50 nhân viên</option>
        </Form.Select>
      </div>

      <Table striped bordered hover className="staff-management-table mt-3">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedStaff.map((member) => (
            <tr key={member._id}>
              <td style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={member.avatar || avatarDefault}
                  alt={member.fullName}
                  className="staff-management-staff-image"
                />
                {member.fullName}
              </td>
              <td>{member.email}</td>
              <td style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {member.isBlocked ? (
                    <FaLock
                      className="text-danger"
                      onClick={() => handleUnlock(member._id)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaUnlock
                      className="text-success"
                      onClick={() => handleLock(member._id)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p>{`Hiển thị ${filteredStaff.length} trên tổng ${staff.length} nhân viên.`}</p>

      <div className="staff-management-pagination-controls text-center">
        <ReactPaginate
          pageCount={Math.ceil(filteredStaff.length / staffPerPage)}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
          previousLabel={"<<"}
          nextLabel={">>"}
        />
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="staff-delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Khóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-center">
            Bạn có chắc chắn muốn khóa nhân viên này không?
          </h5>
          <Button
            className="btn btn-danger d-block mx-auto mt-4"
            // onClick={handleDelete}
          >
            Xóa
          </Button>
        </Modal.Body>
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setValidated(false);
          setNewStaff({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            avatar: avatarDefault,
          });
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm Nhân Viên Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleAddStaff}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                name="fullName"
                value={newStaff.fullName}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập họ và tên
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={newStaff.email}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập email hợp lệ
              </Form.Control.Feedback>
            </Form.Group>

            <div className="text-center mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Thêm Nhân Viên
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default StaffManagement;

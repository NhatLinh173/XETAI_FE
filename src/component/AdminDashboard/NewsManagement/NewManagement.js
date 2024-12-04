import React, { useState, useEffect } from "react";
import { Table, Form, Modal, Button } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus, FaEye } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import axiosInstance from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
const NewManagement = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalAction, setModalAction] = useState("add");
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsPerPage, setNewsPerPage] = useState(10);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
  });
  const creatorId = localStorage.getItem("userId");

  const fetchNew = async () => {
    try {
      const response = await axiosInstance.get(`/blog/`);
      setNews(response.data);
      setFilteredNews(response.data);
      setSelectedNews(response.data[0]);
      console.log(filteredNews);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNew();
  }, []);

  const handleAddNews = async () => {
    if (newItem.title && newItem.image) {
      const formData = new FormData();
      formData.append("creatorId", creatorId);
      formData.append("title", newItem.title);
      formData.append("description", newItem.description);
      formData.append("image", newItem.image);

      try {
        const response = await axiosInstance.post("/blog/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201) {
          toast.success("Thêm tin tức thành công");
          await fetchNew();
          resetForm();
          setShowAddEditModal(false);
        } else {
          toast.error("Thêm tin tức thất bại");
        }
      } catch (error) {
        console.error("Error while adding news:", error);
        toast.error("Đã xảy ra lỗi khi thêm tin tức");
      }
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin cần thiết");
    }
  };

  const handleUpdateNews = async () => {
    if (!selectedNews || !selectedNews._id) {
      console.error("Không có bài viết nào được chọn để cập nhật.");
      return;
    }
    selectedNews.title = newItem.title;
    selectedNews.description = newItem.description;
    selectedNews.image = newItem.image;

    const formData = new FormData();
    formData.append("title", selectedNews.title);
    formData.append("description", selectedNews.description);
    formData.append("image", selectedNews.image);

    try {
      const response = await axiosInstance.put(
        `/blog/${selectedNews._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success("Cập nhật tin tức thành công");

        const updatedNewsList = news.map((item) =>
          item._id === selectedNews._id ? { ...item, ...selectedNews } : item
        );
        await fetchNew();
        setNews(updatedNewsList);
        setShowAddEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Cập nhật tin tức thất bại");
    }
  };

  const confirmDelete = (id) => {
    setSelectedNews(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/blog/${selectedNews}`);
      if (response.status === 200) {
        toast.success("Xóa tin tức thành công");
        setNews(news.filter((newItem) => newItem._id !== selectedNews));
        setShowDeleteModal(false);
        setSelectedNews(null);
      } else {
        toast.error("Xóa tin tức thất bại");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Đã xảy ra lỗi khi xóa tin tức");
    }
  };

  const resetForm = () => {
    setNewItem({ title: "", content: "", date: "", author: "", image: "" });
    setSelectedNews(null);
    setModalAction("add");
  };

  const viewNewsDetails = (newsItem) => {
    setSelectedNews(newsItem);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = news.filter((newItem) =>
      newItem.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredNews(filtered);
  }, [searchTerm, news]);

  return (
    <div className="new-management-container mt-5">
      <h2 className="new-management-title mb-4 text-center">Quản Lý Tin Tức</h2>

      <Button
        onClick={() => {
          setShowAddEditModal(true);
          resetForm();
        }}
        className="mb-3"
      >
        <FaPlus /> Thêm Tin Tức
      </Button>

      <Form className="new-management-search-form mb-4">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>

      <div className="mb-3 d-flex justify-content-end">
        <Form.Select
          aria-label="Chọn số lượng tin tức mỗi trang"
          value={newsPerPage}
          style={{ width: "200px" }}
        >
          <option value="5">5 tin tức</option>
          <option value="10">10 tin tức</option>
          <option value="20">20 tin tức</option>
          <option value="50">50 tin tức</option>
        </Form.Select>
      </div>

      <Table striped bordered hover className="new-management-table mt-3">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Ngày đăng</th>
            <th>Người đăng</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredNews.map((newItem, index) => (
            <tr key={newItem.id}>
              <td>{index + 1}</td>
              <td>{newItem.title}</td>
              <td>{new Date(newItem.createdAt).toLocaleDateString()}</td>
              <td>{newItem?.creatorId?.fullName}</td>
              <td style={{ textAlign: "center" }}>
                {newItem.image && (
                  <img
                    src={newItem.image}
                    alt="new"
                    style={{ width: "300px", height: "150px" }}
                  />
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                <span style={{ display: "inline-block", marginRight: "8px" }}>
                  <FaEye
                    className="new-management-status-icon text-primary"
                    onClick={() => viewNewsDetails(newItem)}
                    style={{ cursor: "pointer" }}
                  />
                </span>
                <span style={{ display: "inline-block", marginRight: "8px" }}>
                  <FaEdit
                    className="new-management-status-icon text-warning"
                    onClick={() => {
                      const updatedItem = {
                        ...selectedNews,
                        title: newItem.title,
                        description: newItem.description,
                        image: newItem.image,
                        author: newItem?.creatorId?.fullName || "",
                      };

                      setNewItem(updatedItem);
                      setSelectedNews(updatedItem);
                      setModalAction("edit");
                      setShowAddEditModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </span>
                <span style={{ display: "inline-block" }}>
                  <FaTrashAlt
                    className="new-management-status-icon text-danger"
                    onClick={() => confirmDelete(newItem._id)}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={showAddEditModal}
        onHide={() => setShowAddEditModal(false)}
        centered
        dialogClassName="news-modal-container"
      >
        <Modal.Header closeButton className="bg-dark bg-opacity-75">
          <Modal.Title>
            {modalAction === "add" ? "Thêm Tin Tức" : "Cập Nhật Tin Tức"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="news-form">
            <Row>
              <Col md={12}>
                <Form.Group controlId="title" className="news-form__group">
                  <Form.Label className="news-form__label">Tiêu đề</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tiêu đề tin tức"
                    value={newItem.title}
                    className="news-form__input"
                    onChange={(e) => {
                      setNewItem({ ...newItem, title: e.target.value });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="content" className="news-form__group">
                  <Form.Label className="news-form__label">Nội dung</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={15}
                    placeholder="Nhập nội dung tin tức"
                    value={newItem.description}
                    className="news-form__textarea"
                    onChange={(e) => {
                      setNewItem({ ...newItem, description: e.target.value });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="image" className="news-form__group">
                  <Form.Label className="news-form__label">Hình ảnh</Form.Label>
                  <div className="news-form__upload-container">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      className="news-form__file-input"
                      onChange={(e) => {
                        setNewItem({ ...newItem, image: e.target.files[0] });
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="news-modal__footer">
          <Button
            variant="secondary"
            onClick={() => setShowAddEditModal(false)}
            className="news-modal__btn news-modal__btn--cancel"
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={modalAction === "add" ? handleAddNews : handleUpdateNews}
            className="news-modal__btn news-modal__btn--submit"
          >
            {modalAction === "add" ? "Thêm" : "Cập Nhật"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xóa Tin Tức */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="bg-dark bg-opacity-75"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa tin tức này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Chi Tiết Tin Tức */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        size="lg"
        className="custom-modal-news bg-dark bg-opacity-75 "
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Chi Tiết Tin Tức</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-news">
          {selectedNews && (
            <div className="news-detail">
              {selectedNews.image && (
                <div className="news-detail-image-container">
                  <img
                    src={selectedNews.image}
                    alt="news"
                    className="news-detail-image"
                  />
                </div>
              )}
              <h5 className="news-detail-title">{selectedNews.title}</h5>
              <div className="news-detail-metadata">
                <p className="news-detail-metadata-item">
                  <span className="news-detail-metadata-label">Ngày đăng:</span>
                  {new Date(selectedNews.createdAt).toLocaleDateString()}
                </p>
                <p className="news-detail-metadata-item">
                  <span className="news-detail-metadata-label">
                    Người đăng:
                  </span>
                  {selectedNews?.creatorId?.fullName}
                </p>
              </div>
              <div className="news-detail-content">
                <p className="news-detail-content-label">Nội dung:</p>
                {selectedNews.description ? (
                  selectedNews.description.split("\n").map((line, index) => (
                    <p key={index} className="news-detail-content-paragraph">
                      {line.trim()}
                    </p>
                  ))
                ) : (
                  <p className="news-detail-empty">Chưa có nội dung.</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default NewManagement;

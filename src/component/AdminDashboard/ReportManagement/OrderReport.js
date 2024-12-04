import React, { useEffect, useState } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { FaTrash } from "react-icons/fa"; // Import icon trash
import useInstanceData from "../../../config/useInstanceData";
import { formatDate } from "../../../utils/formatDate";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "../../../config/axiosConfig";

const ReportManagement = () => {
  const { data: report, refetch } = useInstanceData("/report/post");
  console.log(report);

  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOpenModalDetail, setShowOpenModalDetail] = useState(false);
  const [post, setPost] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (report) {
      setReports(report);
    } else {
      toast.error("report not found");
    }
  }, [report]);
  const displayedReports = reports.slice(
    currentPage * 5, // Thay reportsPerPage bằng 10
    (currentPage + 1) * 5 // Thay reportsPerPage bằng 10
  );

  const handleViewDetails = (postId) => {
    setPost(postId);
    console.log(postId);

    setShowOpenModalDetail(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/report/${reportId}`);
      refetch();
      setShowDeleteModal(false);
      toast.success("Xóa báo cáo thành công");
    } catch (error) {
      toast.error("có xảy ra lỗi!!");
    }
  };
  const handleDelete = (reportId) => {
    setReportId(reportId);
    setShowDeleteModal(true);
    console.log(reportId);
  };

  return (
    <div className="report-management-container mt-5">
      <h2 className="report-management-title mb-4 text-center">
        Quản Lý Báo Cáo Đơn Hàng
      </h2>

      <Table striped bordered hover className="report-management-table mt-3">
        <thead>
          <tr>
            <th>Đơn hàng</th>
            <th style={{ width: "20%" }}>Lý do</th>
            <th>Người tạo đơn</th>
            <th>Người báo cáo</th>
            <th>Ngày báo cáo</th>
            <th style={{ width: "20%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedReports?.map((report) => (
            <tr key={report?._id}>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                {report?.postId._id}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                {report?.description}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                {report?.postId?.creator.email}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                {report?.reporterId?.email}
              </td>
              <td
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "25px",
                }}
              >
                {formatDate(report?.createdAt)}
              </td>
              <td className="d-flex justify-content-center">
                <Button
                  variant="info"
                  onClick={() => handleViewDetails(report.postId)}
                >
                  <IoIosInformationCircleOutline className="icon-large" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(report._id)}
                  className="ms-2"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p>{`Hiển thị ${reports.length} báo cáo.`}</p>

      <div className="report-management-pagination-controls text-center">
        <ReactPaginate
          pageCount={Math.ceil(reports.length / 5)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa đơn hàng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showOpenModalDetail}
        onHide={() => setShowOpenModalDetail(false)}
        centered
        className="custom-modal-admin bg-dark bg-opacity-75"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable" size="lg">
          {" "}
          <div className="row">
            {/* Left Side: Service Details */}
            <div>
              <div className="border rounded p-3 shadow-sm">
                {/* Service Information */}
                <div className="w-100 border-bottom pb-3 mb-3">
                  <div
                    id="carouselExampleControls"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <div className="carousel-inner">
                      {post?.images &&
                        post?.images.map((img, index) => (
                          <div
                            className={`carousel-item text-center ${
                              index === activeIndex ? "active" : ""
                            }`}
                          >
                            <img src={img} className="fix-img" alt="service" />
                          </div>
                        ))}
                    </div>
                    <button
                      className="carousel-control-prev border-0 carousel-bg"
                      type="button"
                      data-target="#carouselExampleControls"
                      data-slide="prev"
                      onClick={prevSlide}
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next border-0  carousel-bg"
                      type="button"
                      data-target="#carouselExampleControls"
                      data-slide="next"
                      onClick={nextSlide}
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">Next</span>
                    </button>
                  </div>
                </div>
                <div>
                  <h5
                    className="font-weight-bold"
                    style={{ marginBottom: "15px" }}
                  >
                    Thông tin chi tiết
                  </h5>
                  <form>
                    <div className="border rounded p-3 shadow-sm">
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label
                            htmlFor="pickupLocation"
                            className="font-weight-bold"
                          >
                            Địa chỉ nhận hàng
                          </label>
                          <div className="d-flex">
                            <input
                              className="height-input-admin"
                              value={post?.startPointCity}
                              disabled
                            ></input>
                            <div className="flex-1">
                              <input
                                id="pickupLocation"
                                value={post?.startPoint}
                                type="text"
                                className="form-control position-relative"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <label
                            htmlFor="dropoffLocation"
                            className="font-weight-bold"
                          >
                            Địa chỉ giao hàng
                          </label>
                          <div className="d-flex ">
                            <input
                              className="height-input-admin"
                              value={post?.destinationCity}
                              disabled
                            ></input>
                            <div className="flex-1">
                              <input
                                id="dropoffLocation"
                                value={post?.destination}
                                type="text"
                                className="form-control position-relative"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-6 ">
                          <label htmlFor="type" className="font-weight-bold">
                            Loại hàng
                          </label>
                          <input
                            id="type"
                            value={post?.title}
                            type="text"
                            className="form-control position-relative"
                            disabled
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="weight" className="font-weight-bold">
                            Tổng Trọng Lượng (KG)
                          </label>
                          <input
                            id="weight"
                            value={post?.load}
                            type="text"
                            className="form-control position-relative"
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="price" className="font-weight-bold ">
                            Giá vận chuyển
                          </label>
                          <input
                            id="price"
                            value={post?.price}
                            type="text"
                            className="form-control position-relative"
                            disabled
                          />
                        </div>

                        <div className="form-group col-md-12">
                          <label
                            htmlFor="description"
                            className="font-weight-bold"
                          >
                            Mô tả đơn hàng
                          </label>
                          <textarea
                            id="description"
                            value={post?.detail}
                            className="form-control position-relative"
                            rows="4"
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <h5
                            className="font-weight-bold"
                            style={{ marginTop: "20px" }}
                          >
                            Thông tin người nhận
                          </h5>
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="name" className="font-weight-bold">
                            Họ và Tên
                          </label>

                          <input
                            id="name"
                            type="text"
                            className="form-control position-relative"
                            value={post?.recipientName}
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="email" className="font-weight-bold">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-control position-relative"
                            value={post?.recipientEmail}
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="phone" className="font-weight-bold">
                            Số điện thoại
                          </label>
                          <input
                            id="phone"
                            type="phone"
                            className="form-control position-relative"
                            value={post?.recipientPhone}
                            disabled
                          />
                        </div>

                        <div className="form-group col-md-12">
                          <h5
                            className="font-weight-bold"
                            style={{ marginTop: "20px" }}
                          >
                            Thông tin người đặt
                          </h5>
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="name" className="font-weight-bold">
                            Họ và Tên
                          </label>

                          <input
                            id="name"
                            type="text"
                            className="form-control position-relative"
                            value={post?.fullname}
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="email" className="font-weight-bold">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-control position-relative"
                            value={post?.email}
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="phone" className="font-weight-bold">
                            Số điện thoại
                          </label>
                          <input
                            id="phone"
                            type="phone"
                            className="form-control position-relative"
                            value={post?.phone}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Right Side: Contact Info */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOpenModalDetail(false)}
          >
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ReportManagement;

import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../../utils/formatDate";
import useInstanceData from "../../../config/useInstanceData";
import { toast } from "react-toastify";
import axios from "../../../config/axiosConfig";

const PostReport = () => {
  // Mock data for reports
  const [reportPostDriver, setReportPostDriver] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);
  const [Post, setPost] = useState(null);

  const { data: postReport, refetch } = useInstanceData("/report/driverPost");
  console.log(postReport);

  useEffect(() => {
    if (postReport) {
      setReportPostDriver(postReport);
    } else {
      toast.error("Không có báo cáo bài đăng!!");
    }
  }, [postReport]);

  const displayedReports = reportPostDriver.slice(
    currentPage * 5,
    (currentPage + 1) * 5
  );
  const confirmDelete = async () => {
    try {
      await axios.delete(`/report/${reportPostId}`);
      setShowDeleteModal(false);
      toast.success("Xóa báo cáo bài đăng thành công");
      refetch();
    } catch (error) {
      toast.error("có xảy ra lỗi!!");
    }
  };
  const handleDelete = (reportId) => {
    setReportPostId(reportId);
    setShowDeleteModal(true);
    console.log(reportId);
  };
  const handleViewDetails = (postId) => {
    setPost(postId);
    console.log(postId);

    setShowDetailModal(true);
  };

  return (
    <div className="post-report-container mt-5">
      <h2 className="post-report-title mb-4 text-center">
        Quản lý báo cáo bài đăng
      </h2>

      <Table striped bordered hover className="post-report-table mt-3">
        <thead>
          <tr>
            <th>Bài đăng</th>
            <th>Lý do</th>
            <th>Người đăng</th>
            <th>Người báo cáo</th>
            <th>Ngày báo cáo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedReports?.map((postReport) => (
            <tr key={postReport?._id}>
              <td>{postReport?.driverPostId._id}</td>
              <td>{postReport?.description}</td>
              <td>{postReport?.driverPostId.creatorId.userId.email}</td>
              <td>{postReport?.reporterId?.email}</td>
              <td>{formatDate(postReport?.createdAt)}</td>
              <td className="d-flex justify-content-center">
                <Button
                  variant="info"
                  onClick={() => handleViewDetails(postReport?.driverPostId)}
                >
                  <IoIosInformationCircleOutline className="icon-large" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(postReport._id)}
                  className="ms-2"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p>{`Displaying ${postReport.length} reports.`}</p>

      <div className="pagination-controls text-center">
        <ReactPaginate
          pageCount={Math.ceil(postReport.length / 5)}
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
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có muốn xóa bài đăng này không??</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Post Report Details Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        className="custom-modal-admin bg-dark bg-opacity-75"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết bài đăng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <div className="row">
            <div className="border rounded p-3 shadow-sm w-100">
              {/* Service Information */}
              <div className="w-100 border-bottom pb-3 mb-3">
                {Post?.images?.length > 0 ? (
                  <div>
                    {Post.images.map((img, index) => (
                      <div key={index} className="mb-3">
                        <img
                          src={img}
                          alt={`service-${index}`}
                          className="w-100 rounded shadow-sm"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted">Không có hình ảnh</p>
                )}
              </div>

              {/* Post Details */}
              <form>
                <div className="border rounded p-3 shadow-sm">
                  <div className="form-group">
                    <label
                      htmlFor="pickupLocation"
                      className="font-weight-bold"
                    >
                      Điểm đi
                    </label>
                    <input
                      id="pickupLocation"
                      value={Post?.startCity || ""}
                      type="text"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="dropoffLocation"
                      className="font-weight-bold"
                    >
                      Điểm đến
                    </label>
                    <input
                      id="dropoffLocation"
                      value={Post?.destinationCity || ""}
                      type="text"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="font-weight-bold">
                      Nội dung bài đăng
                    </label>
                    <textarea
                      id="description"
                      value={Post?.description || ""}
                      className="form-control"
                      rows="4"
                      disabled
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostReport;

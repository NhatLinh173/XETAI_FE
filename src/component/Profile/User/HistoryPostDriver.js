import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FaMapLocation } from "react-icons/fa6";
import { BsFillFilePostFill } from "react-icons/bs";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";


const HistoryPostDriver = () => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const driverId = localStorage.getItem("driverId");

  const getPosts = async () => {
    const response = await axiosInstance.get(`/driverpost/${driverId}`);
    setPosts(response.data);
  };

  // Điều hướng đến trang chi tiết bài đăng
  const handlePostClick = (postId) => {
    history.push(`/history-post-driver/detail/${postId}`);
  };

  // Hiển thị modal xác nhận xoá
  const handleShowModal = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  // Ẩn modal
  const handleCloseModal = () => {
    setShowModal(false);
    setPostToDelete(null);
  };

  // Xoá bài đăng
  const handleDeletePost = async () => {
    const response = await axiosInstance.delete(`/driverpost/${postToDelete}`);

    if (response.status === 200) {
      toast.success("Xoá bài đăng thành công");
      getPosts();
    }

    handleCloseModal();
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (!posts || posts.length === 0) {
    return <div>Không có bài đăng nào</div>;
  }

  return (
    <>
      <h2 className="mb-4">Bài đăng</h2>

      {posts.map((post) => (
        <div
          key={post._id}
          className="my-4 border rounded-12 card-hover position-relative"
          onClick={() => handlePostClick(post._id)} // Điều hướng khi nhấp vào bài đăng
          style={{ cursor: "pointer" }} // Thêm con trỏ chuột dạng tay để chỉ ra đây là một mục có thể nhấp
        >
          <div className="p-3 d-flex">
            {/* Ảnh */}
            <div className="image-container">
              <img
                src={
                  post.images && post.images.length > 0
                    ? post.images[0]
                    : "fallback-image.jpg"
                }
                alt="Hàng hóa"
                className="rounded-12 cursor-pointer"
                style={{ width: "360px", height: "200px", objectFit: "cover" }}
              />
            </div>

            {/* Thông tin bài đăng */}
            <div className="ml-3 flex-1">
              <div className="mb-2 text-secondary d-flex align-items-center">
                <FaMapLocation className="mr-2" />
                <div className="font-weight-bold">Điểm đi:</div>
                <div className="ml-2 flex-grow-1 text-truncate">
                  {post.startCity}
                </div>
              </div>
              <div className="mb-2 text-secondary d-flex align-items-center">
                <FaMapLocation className="mr-2" />
                <div className="font-weight-bold">Điểm đến:</div>
                <div className=" ml-2 flex-grow-1 text-truncate">
                  {post.destinationCity}
                </div>
              </div>
              <div className="mb-2 text-secondary d-flex align-items-baseline">
                <BsFillFilePostFill className="mr-2" />
                <div
                  className="font-weight-bold"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Nội dung:
                </div>
                <div
                  className="flex-grow-1 ml-2"
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                >
                  {post.description}
                </div>
              </div>
              <div
                className="position-absolute"
                style={{ right: "10px", top: "10px" }}
              >
                <button
                  className="btn-danger btn-sm align-self-start border-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện nổi bọt
                    handleShowModal(post._id); // Hiển thị modal xóa
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal Xoá */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xoá bài đăng này không?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Huỷ
          </button>
          <button className="btn btn-danger" onClick={handleDeletePost}>
            Xoá
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HistoryPostDriver;

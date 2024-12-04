// FA24_SEP490_XETAI_FE/src/component/Profile/User/HistoryPost.js
import React, { useEffect, useState } from "react";
import { FaBoxArchive, FaCheck } from "react-icons/fa6";
import { FaWeightHanging } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import { FaCarSide } from "react-icons/fa6";
import { MdOutlinePersonAdd } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GrHide } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";
import axios from "../../../config/axiosConfig";
import useInstanceData from "../../../config/useInstanceData";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBarcode } from "react-icons/fa";
const HistoryPost = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [postID, setPostID] = useState(null);
  const [isDriverExist, setIsDriverExist] = useState(null);
  const [currentPosts, setCurrentPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("all");
  const postsPerPage = 3;

  const [noPostsMessage, setNoPostsMessage] = useState("");
  const [pageCount, setPageCount] = useState(0);

  const userId = localStorage.getItem("userId");
  const driverId = localStorage.getItem("driverId");

  const { data: posts, refetch } = useInstanceData(`/posts/${userId}/users`);

  const { data: postdriver } = useInstanceData(`/posts/${driverId}/driver`);
  console.log(postdriver);

  const { data: dealPriceDriver } = useInstanceData(
    `/dealPrice/driver/${driverId}`
  );

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postID}`);
      refetch();
      setIsShowModal(false);
      toast.success("Đơn hàng đã được xóa thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đơn hàng!");
    }
  };

  const handleOpenModal = (postId) => {
    setPostID(postId);
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
    setPostID(null);
  };
  useEffect(() => {
    if (driverId !== "undefined" && driverId) {
      setIsDriverExist(true);
    } else {
      setIsDriverExist(false);
    }
  }, [driverId]);

  const applyFilter = () => {
    let filteredPosts = [];
    const allowedStatuses = ["wait", "approve", "inprogress", "cancel", "hide"];

    switch (currentFilter) {
      case "wait":
        if (driverId !== "undefined") {
          filteredPosts = dealPriceDriver
            ?.filter((deal) => deal.status === "wait" && deal.postId != null)
            .map((deal) => deal.postId);
        } else {
          filteredPosts = posts?.salePosts?.filter(
            (post) => post.status === "wait"
          );
        }
        break;

      case "approve":
        if (driverId !== "undefined") {
          filteredPosts = dealPriceDriver
            ?.filter(
              (deal) =>
                deal.status === "approve" &&
                deal.postId?.status === "approve" &&
                deal.postId != null
            )
            .map((deal) => deal.postId);
        } else {
          filteredPosts = posts?.salePosts?.filter(
            (post) => post.status === "approve"
          );
        }
        break;

      case "inprogress":
        if (driverId !== "undefined") {
          filteredPosts = dealPriceDriver
            ?.filter(
              (deal) =>
                deal.status === "approve" &&
                deal.postId?.status === "inprogress" &&
                deal.postId != null
            )
            .map((deal) => deal.postId);
        } else {
          filteredPosts = posts?.salePosts?.filter(
            (post) => post.status === "inprogress"
          );
        }
        break;

      case "cancel":
        if (driverId !== "undefined") {
          filteredPosts = dealPriceDriver
            ?.filter((deal) => deal.status === "cancel" && deal.postId != null)
            .map((deal) => deal.postId);
        } else {
          filteredPosts = posts?.salePosts?.filter(
            (post) => post.status === "cancel"
          );
        }
        break;

      case "hide":
        if (driverId !== "undefined") {
          filteredPosts = dealPriceDriver
            ?.filter((deal) => deal.status === "hide" && deal.postId != null)
            .map((deal) => deal.postId);
        } else {
          filteredPosts = posts?.salePosts?.filter(
            (post) => post.status === "hide"
          );
        }
        break;

      default:
        if (driverId !== "undefined") {
          filteredPosts = postdriver?.data?.filter((post) =>
            allowedStatuses.includes(post.status)
          );
        } else {
          filteredPosts =
            posts?.salePosts?.filter((post) =>
              allowedStatuses.includes(post.status)
            ) || [];
        } 
    }

    setPageCount(Math.ceil(filteredPosts?.length / postsPerPage));
    setCurrentPost(
      filteredPosts?.slice(
        currentPage * postsPerPage,
        (currentPage + 1) * postsPerPage
      )
    );
    setNoPostsMessage(
      filteredPosts?.length === 0 ? "Không có đơn hàng nào để hiển thị." : ""
    );
  };

  const handleFilterChange = (filter) => {
    setCurrentPage(0);
    setCurrentFilter(filter);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1); // Cập nhật trang hiện tại
  };

  const getPaginationItems = () => {
    const items = [];
    const totalPages = pageCount;

    if (totalPages <= 5) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === currentPage + 1}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Nếu tổng số trang lớn hơn 5, hiển thị theo kiểu "1234 ... 8910"
      const startPage = Math.max(2, currentPage); // Trang bắt đầu
      const endPage = Math.min(totalPages - 1, currentPage + 2); // Trang kết thúc

      // Hiển thị trang đầu tiên
      items.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage + 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );

      // Hiển thị dấu ba chấm nếu cần
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }

      // Hiển thị các trang giữa
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === currentPage + 1}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      // Hiển thị dấu ba chấm nếu cần
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }

      // Hiển thị trang cuối cùng
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage + 1}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  useEffect(() => {
    applyFilter(); // Gọi applyFilter khi currentPage hoặc currentFilter thay đổi
  }, [currentPage, currentFilter, posts, postdriver, dealPriceDriver]);

  return (
    <div>
      <h2>Đơn Hàng</h2>
      <div className="mb-3 mt-2 d-flex justify-content-center gap-2">
        <button
          className="btn btn-info btn-custom mx-1 d-flex align-items-center"
          onClick={() => handleFilterChange("all")}
        >
          Hiện tất cả
        </button>
        <button
          className="btn btn-warning btn-custom mx-1 d-flex align-items-center"
          onClick={() => handleFilterChange("wait")}
        >
          <CiNoWaitingSign className="mr-1" /> Đang chờ
        </button>
        <button
          className="btn btn-secondary btn-custom mx-1 d-flex align-items-center"
          onClick={() => handleFilterChange("approve")}
        >
          <MdOutlinePersonAdd className="mr-1" /> Đã nhận đơn
        </button>
        <button
          className="btn btn-primary  btn-custom mx-1 d-flex align-items-center"
          onClick={() => handleFilterChange("inprogress")}
        >
          <FaCarSide className="mr-1" /> Đang giao
        </button>
        <button
          className="btn btn-danger btn-custom mx-1 d-flex align-items-center"
          onClick={() => handleFilterChange("cancel")}
        >
          <GiCancel className="mr-1" /> Đã hủy
        </button>

        {!isDriverExist && (
          <button
            className="btn btn-dark btn-custom mx-1 d-flex align-items-center"
            onClick={() => handleFilterChange("hide")}
          >
            <GrHide className="mr-1" /> Tạm ẩn
          </button>
        )}
      </div>
      {noPostsMessage && <div>{noPostsMessage}</div>}
      {currentPosts &&
        currentPosts?.map((post) => (
          <Link
            to={`/history-post/${post._id}`}
            rel="noreferrer"
            className="text-decoration-none"
            key={post._id}
          >
            <div className="my-4 border rounded-12 card-hover position-relative">
              <div className="p-3 d-flex">
                <div className="image-container">
                  <img
                    src={post.images[0]}
                    alt="anh hang hoa"
                    className="rounded-12 cursor-pointer zoom-image"
                    style={{
                      width: "360px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="ml-3">
                  <div className="mb-2 text-secondary d-flex align-items-center">
                    <FaMapLocation className="mr-2" />
                    <div className="font-weight-bold text-nowrap">
                      Địa điểm đi:
                    </div>
                    <div className="w-75 ml-2 text-truncate">
                      {post.startPointCity}
                    </div>
                  </div>
                  <div className="mb-2 text-secondary d-flex align-items-center">
                    <FaMapLocation className="mr-2" />
                    <div className="font-weight-bold text-nowrap">
                      Địa điểm đến:
                    </div>
                    <div className="w-75 ml-2 text-truncate">
                      {post.destinationCity}
                    </div>
                  </div>
                  <div className="mb-2 text-secondary d-flex align-items-center">
                    <FaBoxArchive className="mr-2" />
                    <div className="font-weight-bold mr-2">Loại hàng:</div>
                    {post.title}
                  </div>
                  <div className="mb-2 text-secondary d-flex align-items-center">
                    <FaBoxArchive className="mr-2" />
                    <div className="font-weight-bold mr-2">Khối lượng:</div>
                    {post.load}
                  </div>
                  <div className="mb-4 text-secondary d-flex align-items-center">
                    <FaBarcode className="mr-2" />
                    <div className="font-weight-bold mr-2">Mã đơn hàng:</div>
                    {post.orderCode}
                  </div>

                  <div className="fs-18 font-weight-bold">
                    Giá vận chuyển: {post.price.toLocaleString()} vnd
                  </div>
                  {post.status === "approve" && isDriverExist && (
                    <button className="btn-sm btn-secondary mt-3 border-0">
                      <MdOutlinePersonAdd className="mr-2" />
                      Đã nhận đơn
                    </button>
                  )}
                  {post.status === "approve" && !isDriverExist && (
                    <button className="btn-sm btn-secondary mt-3 border-0">
                      <MdOutlinePersonAdd className="mr-2" />
                      Tài xế đã nhận đơn
                    </button>
                  )}

                  {post.status === "inprogress" && (
                    <button className="btn-sm btn-primary mt-3 border-0 d-flex align-items-center">
                      <FaCarSide className="mr-2" />
                      Đang giao hàng
                    </button>
                  )}
                  {post?.status === "cancel" && (
                    <button className="btn-sm btn-danger mt-3 border-0 d-flex align-items-center">
                      <GiCancel className="mr-2" />
                      Đã hủy
                    </button>
                  )}
                  {post.status === "wait" &&
                  post.dealId?.status === "cancel" &&
                  isDriverExist ? (
                    <button className="btn-sm btn-danger mt-3 border-0 d-flex align-items-center">
                      <GiCancel className="mr-2" />
                      Đã hủy
                    </button>
                  ) : (
                    post.status === "wait" && (
                      <button className="btn-sm btn-warning mt-3 border-0 d-flex align-items-center">
                        <CiNoWaitingSign className="mr-2" />
                        Đang chờ xác nhận
                      </button>
                    )
                  )}
                  {post.status === "hide" && (
                    <button className="btn-sm btn-dark  mt-3 border-0 d-flex align-items-center">
                      <GrHide className="mr-2" />
                      Tạm ẩn
                    </button>
                  )}
                </div>
                {!isDriverExist &&
                  post.status === "cancel" && ( // Kiểm tra trạng thái
                    <div
                      className="position-absolute"
                      style={{ right: "10px", top: "10px" }}
                    >
                      <button
                        className="btn-danger btn-sm align-self-start border-0"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(post._id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </Link>
        ))}

      {pageCount >= 1 && (
        <Pagination>
          <Pagination.Prev
            onClick={() => currentPage > 0 && handlePageChange(currentPage)}
            disabled={currentPage === 0}
          />
          {getPaginationItems()}
          <Pagination.Next
            onClick={() =>
              currentPage < pageCount - 1 && handlePageChange(currentPage + 2)
            }
            disabled={currentPage === pageCount - 1}
          />
        </Pagination>
      )}

      {isShowModal && (
        <div
          className="modal fade show bg-dark bg-opacity-75"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Xác nhận xóa
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa đơn hàng này không?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPost;

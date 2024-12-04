import { useEffect, useMemo, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaCheck, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosConfig";
import { Rating } from "react-simple-star-rating";
import { jwtDecode } from "jwt-decode";
import TripCarousel from "./TripCarousel";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import dayjs from "dayjs";

const TripDetail = () => {
  const [tripDetail, setTripDetail] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [driver, setDriver] = useState("");
  const [ratingDetails, setRatingDetails] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const role = localStorage.getItem("accessToken")
    ? jwtDecode(localStorage.getItem("accessToken")).role
    : "";

  const isDriverRole = useMemo(() => role === "personal", [role]);

  const { id } = useParams();

  const userId = localStorage.getItem("userId");

  const handleFavoriteDriver = async () => {
    try {
      const response = await axiosInstance.post("/favorites/add", {
        driverId: driverId,
        userId: userId,
      });
      if (response.status === 200) {
        toast.success("Đã thêm tài xế vào danh sách yêu thích");
      } else {
        toast.error("Thêm tài xế vào danh sách yêu thích thất bại");
      }
    } catch (error) {
      console.error("Error adding favorite driver:", error);
      toast.error("Có lỗi xảy ra khi thêm tài xế vào danh sách yêu thích.");
    }
  };

  const handleRemoveFavoriteDriver = async () => {
    try {
      const response = await axiosInstance.post("/favorites/remove", {
        driverId: driverId,
        userId: userId,
      });
      if (response.status === 200) {
        toast.success("Đã xóa tài xế khỏi danh sách yêu thích");
      } else {
        toast.error("Xóa tài xế khỏi danh sách yêu thích thất bại");
      }
    } catch (error) {
      console.error("Error removing favorite driver:", error);
      toast.error("Có lỗi xảy ra khi xóa tài xế khỏi danh sách yêu thích.");
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `/favorites/check/status?driverId=${driverId}&userId=${userId}`
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    }
  };

  const handleOpenModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  const handleFeedback = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/rating/${id}`, {
        value: rating,
        comment: feedback,
        userId: driver,
        reviewerId: userId,
      });

      if (response.status === 200) {
        toast.success("Đánh giá tài xế thành công");
        setIsShowModal(false);
        getTripHistoryDetail();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!!");
    }
  };

  const getRatingDetails = async () => {
    try {
      const res = await axiosInstance.get(`/rating/ratings/post/${id}`);
      console.log("Rating details response:", res.data);
      if (res.data.ratings && res.data.ratings.length > 0) {
        setRatingDetails(res.data.ratings[0]);
      } else {
        setRatingDetails(null);
      }
    } catch (error) {
      console.error("Error fetching rating details:", error);
      setRatingDetails(null);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const getTripHistoryDetail = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      setTripDetail(response.data);
      setDriver(response.data.dealId.driverId.userId._id);
      setDriverId(response.data.dealId.driverId._id);
      await getRatingDetails(response.data.dealId.driverId.userId._id);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTripHistoryDetail();
  }, []);

  useEffect(() => {
    if (driverId) {
      checkFavoriteStatus();
    }
  }, [driverId]);

  const handleConfirmReceived = async () => {
    try {
      const response = await axiosInstance.patch("/posts/complete/order", {
        postId: id,
      });
      if (response.status === 200) {
        toast.success("Xác nhận đã nhận hàng thành công");
        getTripHistoryDetail();
      }
    } catch (error) {
      if (error.response) {
        const { code } = error.response.data;
        if (code === "ORDER_ALREADY_CONFIRMED") {
          toast.error("Bạn đã xác nhận đơn hàng này rồi");
        } else if (code === "INSUFFICIENT_BALANCE") {
          toast.error(
            "Số dư trong tài khoản không đủ! Vui lòng nạp tiền để nhận hàng"
          );
        } else if (code === "ORDER_NOT_CONFIRMED") {
          toast.error("Đơn hàng chưa được tài xế xác nhận giao hàng.");
        } else {
          toast.error("Có lỗi xảy ra khi xác nhận đã nhận hàng.");
        }
      } else {
        console.error("Error confirm received:", error);
        toast.error("Có lỗi xảy ra khi xác nhận đã nhận hàng.");
      }
    }
  };

  if (!tripDetail) return <div>Không có data</div>;

  return (
    <div className="wrapper container pb-5">
      <div className="row">
        <div className="col-8 pr-2">
          <div className="border rounded-12 p-3">
            <div className="border-bottom pb-3">
              <TripCarousel
                images={tripDetail.images}
                imgStyle={{
                  objectFit: "cover",
                }}
              />

              <div className="mt-3 d-flex justify-content-between align-items-center">
                {tripDetail.status === "finish" && !isDriverRole ? (
                  <button
                    className="btn-sm btn-primary border-0 d-flex align-items-center"
                    style={{ width: "fit-content" }}
                    onClick={handleConfirmReceived}
                  >
                    <FaBoxOpen className="mr-2" />
                    Đã nhận hàng
                  </button>
                ) : (
                  <button
                    className="btn-sm btn-success border-0 d-flex align-items-center"
                    style={{ width: "fit-content" }}
                  >
                    <FaCheck className="mr-2" />
                    Đã giao hàng
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3">
              <h3 className="mb-3 font-weight-bold">Thời gian giao hàng</h3>

              <div className="d-flex">
                <div>
                  <div className="fw-600">Thời gian khởi hành</div>
                  <div className="fs-20">
                    {dayjs(tripDetail.startTime).format("HH:mm - DD/MM/YYYY")}
                  </div>
                </div>

                <div className="ml-5">
                  <div className="fw-600">Thời gian kết thúc</div>
                  <div className="fs-20">
                    {dayjs(tripDetail.dealId.estimatedTime).format(
                      "HH:mm - DD/MM/YYYY"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 mb-3">
              <h3 className="mb-3 font-weight-bold">Đơn hàng</h3>

              <form>
                <div className="row">
                  <div className="col">
                    <label htmlFor="category" className="font-weight-bold">
                      Loại hàng
                    </label>
                    <input
                      id="category"
                      defaultValue={tripDetail.title}
                      type="text"
                      className="form-control"
                      placeholder="Loại hàng"
                      readOnly
                    />
                  </div>

                  <div className="col">
                    <label
                      htmlFor="deliver_address"
                      className="font-weight-bold"
                    >
                      Giá tiền
                    </label>
                    <input
                      id="deliver_address"
                      defaultValue={`${tripDetail.price.toLocaleString()} VND`}
                      type="text"
                      className="form-control"
                      placeholder="Giá tiền"
                      readOnly
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <label htmlFor="address" className="font-weight-bold">
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      id="address"
                      defaultValue={`${tripDetail.startPoint}, ${tripDetail.startPointCity}`}
                      type="text"
                      className="form-control"
                      placeholder="Địa chỉ nhận hàng"
                      readOnly
                    />
                  </div>

                  <div className="col">
                    <label
                      htmlFor="deliver_address"
                      className="font-weight-bold"
                    >
                      Địa chỉ giao hàng
                    </label>
                    <input
                      id="deliver_address"
                      defaultValue={`${tripDetail.destination}, ${tripDetail.destinationCity}`}
                      type="text"
                      className="form-control"
                      placeholder="Địa chỉ giao hàng"
                      readOnly
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <label htmlFor="address" className="font-weight-bold">
                      Tổng trọng lượng (KG)
                    </label>
                    <input
                      id="address"
                      defaultValue={tripDetail.load}
                      type="number"
                      className="form-control"
                      placeholder="Tổng trọng lượng (KG)"
                      readOnly
                    />
                  </div>

                  <div className="col"></div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <label htmlFor="description" className="font-weight-bold">
                      Mô tả đơn hàng
                    </label>
                    <div style={{ height: "300px" }}>
                      <textarea
                        id="description"
                        defaultValue={tripDetail.detail}
                        className="w-full form-control"
                        placeholder="Mô tả đơn hàng"
                        readOnly
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-4">
              <h3 className="mb-3 font-weight-bold">Thông tin người nhận</h3>
              <form>
                <div className="row">
                  {/* Ô đầu tiên */}
                  <div className="col-md-6">
                    <label htmlFor="customer-name" className="font-weight-bold">
                      Họ và tên
                    </label>
                    <input
                      id="customer-name"
                      defaultValue={tripDetail.recipientName}
                      type="text"
                      className="form-control custom-input_trip"
                      placeholder="Họ và tên"
                      readOnly
                    />
                  </div>

                  {/* Ô thứ hai */}
                  <div className="col-md-6">
                    <label htmlFor="phone-number" className="font-weight-bold">
                      Số điện thoại
                    </label>
                    <input
                      id="phone-number"
                      defaultValue={tripDetail.recipientPhone}
                      type="tel"
                      className="form-control custom-input_trip"
                      placeholder="Số điện thoại"
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-4">
              <h3 className="mb-3 font-weight-bold">Thông tin người đặt</h3>

              <form>
                <div className="row">
                  {/* Ô đầu tiên */}
                  <div className="col-md-6">
                    <label htmlFor="customer-name" className="font-weight-bold">
                      Họ và tên
                    </label>
                    <input
                      id="customer-name"
                      defaultValue={tripDetail.fullname}
                      type="text"
                      className="form-control custom-input_trip"
                      placeholder="Họ và tên"
                      readOnly
                    />
                  </div>

                  {/* Ô thứ hai */}
                  <div className="col-md-6">
                    <label htmlFor="phone-number" className="font-weight-bold">
                      Số điện thoại
                    </label>
                    <input
                      id="phone-number"
                      defaultValue={tripDetail.phone}
                      type="tel"
                      className="form-control custom-input_trip"
                      placeholder="Số điện thoại"
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {isShowModal && (
          <div
            class="modal fade show"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-lg">
              <div class="modal-content ">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Đánh giá chuyến hàng
                  </h5>
                </div>
                <div class="modal-body flex-column">
                  <div className="">
                    <div className="d-flex justify-content-center mb-3">
                      {[...Array(5)].map((star, index) => {
                        const value = index + 1;
                        return (
                          <div
                            key={index}
                            className="cursor-pointer"
                            onClick={() => handleRatingClick(value)}
                            onMouseEnter={() => setHover(value)}
                            onMouseLeave={() => setHover(null)}
                          >
                            {value <= (hover || rating) ? (
                              <FaStar size={30} color="yellow" />
                            ) : (
                              <CiStar size={30} color="#000" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    placeholder="Đánh giá"
                    rows="4"
                    value={feedback}
                    onChange={handleFeedback}
                  />
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Gủi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-4 pl-2">
          <div className="border rounded-12 shadow-sm overflow-hidden">
            <h4 className="text-center border-bottom p-3">
              {isDriverRole ? "Thông tin người tạo đơn" : "Thông tin tài xế"}
            </h4>

            <div className="contact-info">
              <div
                className="py-2"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <img
                    src={
                      isDriverRole
                        ? tripDetail.creator.avatar
                        : tripDetail.dealId.driverId.userId.avatar
                    }
                    className="mt-3 contact-avatar rounded-circle"
                    alt="contact avatar"
                  />

                  {!isDriverRole &&
                    (isFavorite ? (
                      <IoHeartSharp
                        style={{
                          cursor: "pointer",
                          color: "#ec0101",
                          fontSize: "22",
                          position: "absolute",
                          right: "10px",
                          top: "5px",
                        }}
                        onClick={async () => {
                          try {
                            await handleRemoveFavoriteDriver(); // Gọi hàm xóa yêu thích
                            setIsFavorite(false); // Cập nhật lại state nếu thành công
                          } catch (error) {
                            console.error(
                              "Error removing favorite driver:",
                              error
                            );
                          }
                        }}
                      />
                    ) : (
                      <IoHeartOutline
                        style={{
                          cursor: "pointer",
                          color: "#ec0101",
                          fontSize: "22",
                          position: "absolute",
                          right: "10px",
                          top: "5px",
                        }}
                        onClick={async () => {
                          try {
                            await handleFavoriteDriver(); // Gọi hàm thêm yêu thích
                            setIsFavorite(true); // Cập nhật lại state nếu thành công
                          } catch (error) {
                            console.error(
                              "Error adding favorite driver:",
                              error
                            );
                          }
                        }}
                      />
                    ))}
                </div>
              </div>

              <div className="contact-details">
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Tên:</strong>
                    <span className="text-muted">
                      {isDriverRole
                        ? tripDetail.creator.fullName
                        : tripDetail.dealId.driverId.userId.fullName}
                    </span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center bg-light mt-2">
                    <strong>Số điện thoại:</strong>
                    <span className="text-muted">
                      {isDriverRole
                        ? tripDetail.creator.phone
                        : tripDetail.dealId.driverId.userId.phone}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="py-3 d-flex align-items-center justify-content-center">
                {!isDriverRole && !ratingDetails && (
                  <button
                    type="button"
                    class="ml-3 btn-sm btn-danger border-0"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={handleOpenModal}
                  >
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>

          {ratingDetails && (
            <div className="mt-3 border rounded-12 shadow-sm overflow-hidden p-3">
              <div>
                <div className="d-flex justify-content-between border-bottom pb-2 pt-1">
                  <h5 className="font-weight-bold">Đánh giá</h5>
                  <Rating
                    initialValue={ratingDetails.value}
                    size={26}
                    readonly
                  />
                </div>

                <div className="mt-3">
                  <div>
                    <i>"{ratingDetails.comment}"</i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;

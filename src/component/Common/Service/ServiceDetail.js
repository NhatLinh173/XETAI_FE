import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axiosInstance from "../../../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";

const ServiceDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [postData, setPostData] = useState("");
  const [inforPoster, setInforPoster] = useState("");
  const [idPoster, setIdPoster] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [dealId, setDealId] = useState(null);
  const [isOrderAccepted, setIsOrderAccepted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deliveryHour, setDeliveryHour] = useState("");

  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem("accessToken");
      const driverId = localStorage.getItem("driverId");
      setDriverId(driverId);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded && decoded.role) {
            return decoded.role;
          } else {
            throw new Error("Role not found in token");
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          return null;
        }
      }
      return null;
    };

    const role = decodeToken();
    setUserRole(role);
  }, []);

  useEffect(() => {
    const getPostById = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        setPostData(response.data);
        if (response.data.dealId && response.data.dealId.driverId) {
          setDealId(response.data.dealId.driverId._id);
        } else {
          setDealId(null);
        }

        if (response.data.creator && response.data.creator._id) {
          setIdPoster(response.data.creator._id);
          setPostId(response.data._id);
          setLoading(false);
        } else {
          console.error("ID người đăng không hợp lệ:", response.data.creator);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    if (id) {
      getPostById();
    }
  }, [id]);

  useEffect(() => {
    const getCreatorInfo = async () => {
      try {
        if (!idPoster) {
          console.error("ID người đăng không hợp lệ:", idPoster);
          return;
        }
        const posterId =
          typeof idPoster === "string" ? idPoster : idPoster.toString();
        const response = await axiosInstance.get(`/auth/user/${posterId}`);
        if (response.data) {
          setInforPoster(response.data);
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người đăng:", error);
      }
    };

    if (idPoster) {
      getCreatorInfo();
    }
  }, [idPoster]);

  const handleAcceptOrder = async () => {
    setShowModal(true);
    setIsConfirming(true);
  };
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % postData.images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? postData.images.length - 1 : prevIndex - 1
    );
  };

  const handleConfirmPrice = () => {
    setIsConfirming(false);
  };

  const handleNegotiatePrice = () => {
    setIsNegotiating(true);
    setIsConfirming(false);
  };

  const handleSubmitOrder = async () => {
    if (!deliveryTime) {
      toast.error("Vui lòng chọn thời gian dự kiến giao hàng");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-CA");
    const deliveryDate = new Date(deliveryTime).toLocaleDateString("en-CA");

    console.log(currentDate + " " + deliveryDate);

    if (deliveryDate < currentDate) {
      toast.error("Thời gian giao hàng dự kiến không được ở quá khứ");
      return;
    }

    try {
      const response = await axiosInstance.patch(`/posts/${postId}/deal`, {
        driverId,
        status: "approve",
        deliveryTime,
        dealPrice: postData.price,
        deliveryHour,
      });

      if (response.status === 200) {
        setShowModal(false);
        setIsOrderAccepted(true);
        toast.success("Chấp nhận đơn hàng thành công", { autoClose: 2000 });
      }
    } catch (error) {
      if (error.response && error.response.status === 402) {
        toast.error("Thời gian giao hàng dự kiến không hợp lệ!");
      } else if (error.response && error.response.status === 422) {
        toast.error("Tài xế chưa đăng ký xe");
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      }
    }
  };

  const handleSubmitNegotiation = async () => {
    if (!deliveryTime) {
      toast.error("Vui lòng chọn thời gian dự kiến giao hàng");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-CA");
    const deliveryDate = new Date(deliveryTime).toLocaleDateString("en-CA");

    console.log(currentDate + " " + deliveryDate);

    if (deliveryDate < currentDate) {
      toast.error("Thời gian giao hàng dự kiến không được ở quá khứ");
      return;
    }

    try {
      const response = await axiosInstance.patch(`/posts/${postId}/deal`, {
        driverId,
        status: "wait",
        deliveryTime,
        dealPrice: negotiatedPrice,
        deliveryHour,
      });
      if (response.status === 200) {
        setShowModal(false);
        setIsOrderAccepted(true);
        toast.success("Thương lượng giá thành công", { autoClose: 2000 });
      } else {
        console.error("Lỗi khi thương lượng giá:", response.data);
        toast.error("Thương lượng giá thất bại");
      }
    } catch (error) {
      if (error.response && error.response.status === 402) {
        toast.error("Thời gian giao hàng dự kiến không hợp lệ!");
      } else {
        console.error(error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNegotiatedPrice("");
    setDeliveryTime("");
    setIsNegotiating(false);
    setIsConfirming(false);
    setDeliveryHour("");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = new Intl.NumberFormat().format(value);
    setNegotiatedPrice(formattedValue);
  };

  const handleClose = () => {
    history.goBack();
  };

  if (!postData) return <div>Loading...</div>;

  return (
    <div className="wrapper container pb-5">
      <ToastContainer />
      <div className="row">
        <div className="col-md-8">
          <div className="border rounded p-3 shadow-sm">
            <div className="d-flex border-bottom pb-3 mb-3 pl-3">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-ride="carousel"
              >
                <div className="carousel-inner">
                  {postData.images &&
                    postData.images.map((img, index) => (
                      <div
                        className={`carousel-item text-center ${
                          index === activeIndex ? "active" : ""
                        }`}
                      >
                        <img src={img} className="" alt="service" />
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
              <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
                Thông tin chi tiết
              </h5>
              <form>
                <div className="border rounded p-3 shadow-sm">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="type" className="font-weight-bold">
                        Loại hàng
                      </label>
                      <input
                        id="type"
                        defaultValue={postData.title}
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="weight" className="font-weight-bold">
                        Khối lượng
                      </label>
                      <input
                        id="weight"
                        defaultValue={`${postData.load} kg`}
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label
                        htmlFor="pickupLocation"
                        className="font-weight-bold"
                      >
                        Địa điểm lấy hàng
                      </label>
                      <input
                        id="pickupLocation"
                        defaultValue={postData.startPoint}
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label
                        htmlFor="dropoffLocation"
                        className="font-weight-bold"
                      >
                        Địa điểm trả hàng
                      </label>
                      <input
                        id="dropoffLocation"
                        defaultValue={postData.destination}
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="price" className="font-weight-bold">
                        Giá
                      </label>
                      <input
                        id="price"
                        defaultValue={postData.price}
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label
                        htmlFor="dropoffLocation"
                        className="font-weight-bold"
                      >
                        Phương thức thanh toán
                      </label>
                      <input
                        id="dropoffLocation"
                        defaultValue={
                          postData.paymentMethod === "bank_transfer"
                            ? "Chuyển khoản ngân hàng"
                            : postData.paymentMethod === "cash"
                            ? "Tiền mặt"
                            : "Không xác định"
                        }
                        type="text"
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <label htmlFor="description" className="font-weight-bold">
                        Mô tả đơn hàng
                      </label>
                      <textarea
                        id="description"
                        defaultValue={postData.detail}
                        className="form-control"
                        readOnly
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Thông tin người đặt
            <div className="mt-4">
              <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
                Thông tin người đặt
              </h5>
              <div className="border rounded p-3 shadow-sm">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="posterName" className="font-weight-bold">
                      Họ và tên
                    </label>
                    <input
                      id="posterName"
                      defaultValue={postData.fullname}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="posterPhone" className="font-weight-bold">
                      Số điện thoại
                    </label>
                    <input
                      id="posterPhone"
                      defaultValue={postData.phone}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="posterEmail" className="font-weight-bold">
                      Email
                    </label>
                    <input
                      id="posterEmail"
                      defaultValue={postData.email}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Thông tin người nhận */}
            <div className="mt-4">
              <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
                Thông tin người nhận
              </h5>
              <div className="border rounded p-3 shadow-sm">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="receiverName" className="font-weight-bold">
                      Họ và tên
                    </label>
                    <input
                      id="receiverName"
                      defaultValue={postData.recipientName}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="receiverPhone" className="font-weight-bold">
                      Số điện thoại
                    </label>
                    <input
                      id="receiverPhone"
                      defaultValue={postData.recipientPhone}
                      type="text"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              {(userRole === "personal" || userRole === "business") &&
                dealId !== driverId &&
                !isOrderAccepted && (
                  <button
                    className="btn btn-accept-order"
                    onClick={handleAcceptOrder}
                  >
                    Chấp nhận đơn hàng
                  </button>
                )}
              <button className="btn btn-theme" onClick={handleClose}>
                Đóng
              </button>
            </div>
          </div>

          {/* Modal */}
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            className="order-acceptance-modal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chấp nhận đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {isConfirming && !isNegotiating ? (
                <>
                  <p>Bạn có muốn chấp nhận giá này: {postData.price}?</p>
                  <Button
                    className="success text-white"
                    onClick={handleConfirmPrice}
                    style={{ marginBottom: "10px" }}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    className="secondary text-white"
                    onClick={handleNegotiatePrice}
                  >
                    Thương lượng giá
                  </Button>
                </>
              ) : isNegotiating ? (
                <>
                  <p>Nhập giá mong muốn:</p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={negotiatedPrice}
                      onChange={handlePriceChange}
                      placeholder="Nhập giá mong muốn"
                    />
                    <span className="currency-unit ml-2">VND</span>
                  </div>
                  <p>Ngày dự kiến giao hàng:</p>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p>Thời gian dự kiến (giờ):</p>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={deliveryHour}
                    onChange={(e) => setDeliveryHour(e.target.value)}
                  />
                  <Button
                    className="info text-white"
                    onClick={handleSubmitNegotiation}
                  >
                    Gửi yêu cầu thương lượng
                  </Button>
                </>
              ) : (
                <>
                  <p>Ngày dự kiến giao hàng:</p>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p>Thời gian dự kiến (giờ):</p>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={deliveryHour}
                    onChange={(e) => setDeliveryHour(e.target.value)}
                  />
                  <Button
                    className="info text-white"
                    onClick={handleSubmitOrder}
                  >
                    Gửi yêu cầu
                  </Button>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn btn-close-order secondary"
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* Right Side: Sidebar */}
        <div className="col-md-4">
          <div className="border rounded p-4 shadow-sm">
            <h5 className="font-weight-bold mb-3 text-center">Người tạo đơn</h5>
            <div className="contact-info text-center">
              <div className="contact-avatar-wrapper mb-3">
                <img
                  src={inforPoster.avatar || avatarDefault}
                  className="contact-avatar rounded-circle border"
                  alt="contact avatar"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="contact-details">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                    <strong className="text-left">Tên:</strong>
                    <span className="contact-name text-muted text-right">
                      {inforPoster.fullName}
                    </span>
                  </li>
                  {/* <li className="list-group-item d-flex justify-content-between align-items-center bg-light mt-2 mb-2">
                    <strong className="text-left">Số điện thoại:</strong>
                    <span className="contact-phone text-muted text-right">
                      {inforPoster.phone}
                    </span>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

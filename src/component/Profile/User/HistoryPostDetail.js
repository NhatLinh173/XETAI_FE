import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useInstanceData from "../../../config/useInstanceData";
import axios from "axios";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";
import { GiCancel } from "react-icons/gi";
import { GrHide } from "react-icons/gr";
import { FaCarSide, FaCheck } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import imgUpload from "../../../assets/img/homepage/output-onlinepngtools.png";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { formatDate } from "../../../utils/formatDate";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";

const HistoryPostDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [receiverId, setReceiverId] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityFrom, setCityFrom] = useState("");
  const [cityTo, setCityTo] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newPhone, setNewPhone] = useState(0);
  const [newtitle, setNewTitle] = useState("");
  const [newStartPoint, setNewStartPoint] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [recipientName, setRecipentName] = useState("");
  const [recipientPhone, setRecipentPhone] = useState("");
  const [status, setStatus] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [dealIdUpdate, setDealIdUpdate] = useState(null);
  const [isShowModalCancel, setIsShowModalCancel] = useState(false);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderCode, setOrderCode] = useState("");

  // các biến lỗi
  const [titleError, setTitleError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [startPointError, setStartPointError] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [recipentNameError, setRecipentNameError] = useState("");
  const [recipentPhoneError, setRecipentPhoneError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [totalImage, setTotalImage] = useState([]);

  const [isDriverExist, setIsDriverExist] = useState(false);
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const getCity = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/");
      setCities(res.data);
    } catch (error) {}
  };
  const driverId = localStorage.getItem("driverId");

  const { data: post } = useInstanceData(`/posts/${id}`);
  console.log(post);
  const { data: deals } = useInstanceData(`/dealPrice/${id}`);

  const isDealPriceAvailable = deals && deals.length > 0;

  useEffect(() => {
    if (deals && deals.length > 0) {
      const deal = deals[0];
      if (deal && deal.driverId && deal.driverId.userId) {
        setReceiverId(deal.driverId.userId._id);
      } else {
        console.warn("Deal data not ready or structure is incorrect:", deal);
      }
    }
  }, [deals]);

  const handleConfirmDriver = async () => {
    try {
      const res = await axiosInstance.patch(`/dealPrice/status/${id}`, {
        dealId: dealIdUpdate,
        status: "approve",
      });
      setIsShowModal(false);
      if (res.status === 200) {
        toast.success("Xác nhận tài xế thành công");
      } else {
        toast.error("Xác nhận tài xế thất bại");
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (driverId !== "undefined" && driverId) {
      setIsDriverExist(true);
    } else {
      setIsDriverExist(false);
    }
  }, [driverId]);

  useEffect(() => {
    if (post) {
      if (!Array.isArray(images) || images.length === 0) {
        setImages(post.images || []);
      }

      setNewTitle(post.title);
      setNewPrice(post.price);
      setNewFullName(post.fullname);
      setNewPhone(post.phone);
      setNewStartPoint(post.startPoint);
      setNewDestination(post.destination);
      setNewDetail(post.detail);
      setNewWeight(post.load);
      getCity();
      setCityFrom(post.startPointCity);
      setCityTo(post.destinationCity);
      setRecipentName(post.recipientName);
      setRecipentPhone(post.recipientPhone);
      setStatus(post.status);
      setPaymentMethod(post.paymentMethod);
      setOrderCode(post.orderCode);
    }
  }, [post]);

  useEffect(() => {
    if (Array.isArray(images) && Array.isArray(newImages)) {
      let total = [...images, ...newImages.map((img) => img.url)];
      setTotalImage(total);
    }
  }, [images, newImages]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    newImages.forEach((img) => {
      formData.append("newImages", img.file);
    });
    formData.append("creator", userId);
    formData.append("phone", newPhone);
    formData.append("fullname", newFullName);
    formData.append("title", newtitle);
    formData.append("startPoint", newStartPoint);
    formData.append("destination", newDestination);
    formData.append("load", newWeight);
    formData.append("price", newPrice);
    formData.append("detail", newDetail);
    formData.append("startPointCity", cityFrom);
    formData.append("destinationCity", cityTo);
    formData.append("recipientName", recipientName);
    formData.append("recipientPhone", recipientPhone);
    formData.append("paymentMethod", paymentMethod);
    formData.append("orderCode", orderCode);
    if (status === "cancel" && post.status === "wait" && isDriverExist) {
      formData.append("status", "wait");
    } else {
      formData.append("status", status);
    }
    formData.append("oldImages", images);
    if (status === "cancel") {
      setFormData(formData);
      setIsShowModalCancel(true);
    } else {
      await submitFormData(formData);
    }
  };

  const submitFormData = async (formData) => {
    try {
      if (post.status === "wait" && status === "cancel" && isDriverExist) {
        try {
          const response = await axiosInstance.patch(
            `/dealPrice/status/${id}`,
            {
              dealId: deals[0]._id,
              status: "cancel",
            }
          );
          const res = await axiosInstance.patch(`/posts/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.status === 200 && res.status === 200) {
            toast.success("Cập nhật thành công!");
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else if (status === "cancel" && !isDriverExist) {
        try {
          if (!post.dealId) {
            const res = await axiosInstance.patch(`/posts/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (res.status === 200) {
              toast.success("Cập nhật thành công!");
            }
          } else {
            const response = await axiosInstance.patch(
              `/dealPrice/status/${id}`,
              {
                dealId: deals[0]._id,
                status: "cancel",
              }
            );
            const res = await axiosInstance.patch(`/posts/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (response.status === 200 && res.status === 200) {
              toast.success("Cập nhật thành công!");
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      } else {
        const res = await axiosInstance.patch(`/posts/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 200) {
          toast.success("Cập nhật thành công!");

          const driverId = localStorage.getItem("driverId");
          if (driverId !== null && status === "finish") {
            const priceValue = formData
              .get("price")
              .replace(/\./g, "")
              .replace(/\,/g, "");

            const earnings = priceValue;
            const trips = 1;

            await axiosInstance.put(`/driver/statistics/${driverId}`, {
              earnings: Number(earnings),
              trips: Number(trips),
            });
          }
          if (isDriverExist === true) {
            const sendEmail = await axiosInstance.post("/send/email", {
              to: post.email,
              subject: "Hủy Đơn Hàng ",
              templateName: "driverOrderCancelled",
              templateArgs: [post?.dealId.driverId.userId.fullName, post._id],
            });
          } else {
            const sendEmail = await axiosInstance.post("/send/email", {
              to: post?.dealId.driverId.userId.email,
              subject: "Hủy Đơn Hàng ",
              templateName: "userOrderCancelled",
              templateArgs: [post.fullname, post._id],
            });
          }
        } else {
          toast.error("Cập nhật không thành công!");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 402) {
        toast.error(
          "Bạn không đủ tiền để trả phí hủy đơn hàng! Vui lòng nạp tiền để hủy đơn"
        );
      }
    }
  };

  const handleConfirmModalCancel = async () => {
    setIsShowModalCancel(false);
    if (formData) {
      await submitFormData(formData);
      setFormData(null);
    }
  };

  const handleCloseModalCancel = () => {
    setIsShowModalCancel(false);
  };

  const handleOpenModal = (dealId) => {
    setIsShowModal(true);
    setDealIdUpdate(dealId);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };
  const handleTitle = (e) => {
    const value = e.target.value;
    if (value.length > 50) {
      setTitleError("*Trường này giới hạn 50 ký tự");
      setIsDisable(true);
      setTitleError("");
    }
    setNewTitle(value);
    setIsDisable(false);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (value.length > 30) {
      setFullNameError("*Trường này giới hạn 30 ký tự");
      setIsDisable(true);
    } else if (!nameRegex.test(value)) {
      setFullNameError("*Trường này không được nhập số");
      setIsDisable(true);
    } else {
      setFullNameError("");
      setIsDisable(false);
    }
    setNewFullName(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setPhoneError("*Trường này chỉ nhập số");
      setIsDisable(true);
    } else if (value.length !== 10) {
      setPhoneError("*Trường này chỉ nhập 10 số");
      setIsDisable(true);
    } else {
      setPhoneError("");
      setIsDisable(false);
    }
    setNewPhone(value);
  };

  const handleStartPoint = (e) => {
    const value = e.target.value;
    if (value.length > 60) {
      setStartPointError("*Trường này giới hạn 60 ký tự");
      setIsDisable(true);
    } else {
      setStartPointError("");
      setIsDisable(false);
    }
    setNewStartPoint(value);
  };

  const handleDestination = (e) => {
    const value = e.target.value;
    if (value.length > 60) {
      setDestinationError("*Trường này giới hạn 60 ký tự");
      setIsDisable(true);
    } else {
      setDestinationError("");
      setIsDisable(false);
    }
    setNewDestination(value);
  };

  const handlePrice = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép nhập số
    if (value === "") {
      setNewPrice("");
      setPriceError("*Trường này không được để trống");
      setIsDisable(true);
    } else {
      const formattedValue = new Intl.NumberFormat().format(value);
      setNewPrice(formattedValue);
      setPriceError("");
      setIsDisable(false);
    }
  };

  const handleLoad = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setWeightError("*Trường này chỉ nhập số");
      setIsDisable(true);
    } else {
      setWeightError("");
      setIsDisable(false);
    }
    setNewWeight(value);
  };
  const handleNewDetail = (e) => {
    const value = e.target.value;

    if (value.length > 150) {
      setDetailError("*Trường này giới hạn 150 kí tự");
      setIsDisable(true);
    } else {
      setDetailError(""); // Xóa lỗi khi hợp lệ
      setIsDisable(false);
    }

    setNewDetail(value); // Cập nhật giá trị mới cho detail
  };

  const handleReceptionName = (e) => {
    const value = e.target.value;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (value.length > 30) {
      setRecipentNameError("*Trường này giới hạn 30 ký tự");
      setIsDisable(true);
    } else if (!nameRegex.test(value)) {
      setRecipentNameError("*Trường này không được nhập số");
      setIsDisable(true);
    } else {
      setRecipentNameError("");
      setIsDisable(false);
    }
    setRecipentName(value);
  };

  const handleReceptionPhone = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setRecipentPhoneError("*Trường này chỉ nhập số");
      setIsDisable(true);
    } else if (value.length !== 10) {
      setRecipentPhoneError("*Trường này chỉ nhập 10 số");
      setIsDisable(true);
    } else {
      setRecipentPhoneError("");
      setIsDisable(false);
    }
    setRecipentPhone(value);
  };

  const handleCityFrom = (e) => {
    setCityFrom(e.target.value);
  };
  const handleCityTo = (e) => {
    setCityTo(e.target.value);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + totalImage.length > 3) {
      toast.error("You can only upload up to 3 images.");
      return;
    }
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setNewImages((prevImgs) => [...prevImgs, ...filePreviews]);
  };
  const handleDeleteImage = (index) => {
    const updatedImgs = images.filter((_, i) => i !== index);
    setImages(updatedImgs);
    setTotalImage(updatedImgs);
  };

  return (
    <div className="wrapper container pb-5">
      <ToastContainer />
      <div className="row">
        {/* Left Side: Service Details */}
        <div className="col-md-8">
          {(post.status === "wait" || post.status === "hide") &&
            !isDriverExist && (
              <div>
                {totalImage.length > 0 && (
                  <div>
                    {/* Hiển thị ảnh đã tải lên */}
                    <div
                      className={`d-flex image-form align-items-center mb-3 ${
                        totalImage.length === 1
                          ? "justify-content-center"
                          : totalImage.length === 2
                          ? "justify-content-center w-100"
                          : "justify-content-between w-100"
                      }`}
                    >
                      {totalImage.map((image, index) => (
                        <div
                          className={`position-relative border rounded-12 p-3 d-inline-block ${
                            totalImage.length === 1 ? "w-75" : ""
                          }`}
                        >
                          <img
                            src={image}
                            alt=""
                            className={`rounded-12 ${
                              totalImage.length === 1 ? "w-100" : ""
                            }`}
                          />
                          <IoCloseCircleOutline
                            className={`position-absolute ${
                              totalImage.length === 1
                                ? "delete-img"
                                : "delete-imgs"
                            }`}
                            onClick={() => handleDeleteImage(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <input
                    className="input-custom"
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label
                    className="border rounded-12 p-3 pointer img-upload width-img"
                    htmlFor="file-upload"
                  >
                    <img src={imgUpload} alt="upload" />
                  </label>
                  <p className="font-weight-bold">Tải ảnh lên</p>
                </div>
              </div>
            )}

          <div className="border rounded p-3 shadow-sm">
            {/* Service Information */}
            {(post.status === "cancel" ||
              post.status === "inprogress" ||
              post.status === "finish" ||
              post.status === "complete" ||
              post.status === "approve" ||
              (post.status === "hide" && isDriverExist)) && (
              <div className="w-100 border-bottom pb-3 mb-3">
                <div
                  id="carouselExampleControls"
                  className="carousel slide"
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    {images &&
                      images.map((img, index) => (
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
            )}
            {post.status === "wait" && isDriverExist && (
              <div className="w-100 border-bottom pb-3 mb-3">
                <div
                  id="carouselExampleControls"
                  className="carousel slide"
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    {images &&
                      images.map((img, index) => (
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
            )}
            <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
              Trạng thái đơn hàng
            </h5>
            <div className="form-group col-md-6 ">
              {post.status === "cancel" && (
                <button className="btn-sm btn-danger mt-3 border-0 d-flex align-items-center">
                  <GiCancel className="mr-2" />
                  Đã hủy
                </button>
              )}
              {post.status === "wait" &&
                post?.dealId?.status === "cancel" &&
                isDriverExist && (
                  <button className="btn-sm btn-danger mt-3 border-0 d-flex align-items-center">
                    <GiCancel className="mr-2" />
                    Đã hủy
                  </button>
                )}
              {post.status === "hide" &&
                post?.dealId?.status === "wait" &&
                isDriverExist && (
                  <button className="btn-sm btn-dark  mt-3 border-0 d-flex align-items-center">
                    <GrHide className="mr-2" />
                    Tạm ẩn
                  </button>
                )}

              {(post.status === "wait" || post.status === "hide") &&
                !isDriverExist && (
                  <select
                    id="orderAction"
                    className={`form-control custom-select-arrow w-75 ${
                      status === "cancel"
                        ? "bg-danger text-white "
                        : status === "hide"
                        ? "bg-secondary text-white "
                        : status === "wait"
                        ? "bg-warning text-Black"
                        : ""
                    } `}
                    value={status}
                    onChange={handleStatus}
                  >
                    <option value="hide" class="bg-white options-text">
                      Tạm ẩn đơn hàng
                    </option>
                    <option value="cancel" class="bg-white options-text">
                      Hủy đơn hàng
                    </option>
                    <option value="wait" class="bg-white options-text">
                      Đang chờ duyệt
                    </option>
                  </select>
                )}
              {post.status === "wait" &&
                post?.dealId?.status === "wait" &&
                isDriverExist && (
                  <select
                    id="orderAction"
                    className={`form-control custom-select-arrow w-75 ${
                      status === "cancel"
                        ? "bg-danger text-white "
                        : status === "wait"
                        ? "bg-warning text-Black"
                        : ""
                    } `}
                    value={status}
                    onChange={handleStatus}
                  >
                    <option
                      value="wait"
                      disabled
                      className="bg-white options-text"
                    >
                      Đang chờ duyệt
                    </option>
                    <option value="cancel" class="bg-white options-text">
                      Hủy đơn hàng
                    </option>
                  </select>
                )}
              {post.status === "inprogress" && !isDriverExist && (
                <button className="btn-sm btn-primary  mt-3 border-0 d-flex align-items-center">
                  <FaCarSide className="mr-2" />
                  Đang giao hàng
                </button>
              )}
              {post.status === "inprogress" && isDriverExist && (
                <select
                  id="orderAction"
                  className={`form-control custom-select-arrow w-75 ${
                    status === "inprogress"
                      ? "bg-primary text-white "
                      : status === "finish"
                      ? "bg-success text-white"
                      : ""
                  } `}
                  value={status}
                  onChange={handleStatus}
                >
                  <option value="inprogress" className="bg-white options-text">
                    Đang giao hàng
                  </option>
                  <option value="finish" class="bg-white options-text">
                    Đã giao hàng
                  </option>
                </select>
              )}
              {post.status === "approve" && !isDriverExist && (
                <select
                  id="orderAction"
                  className={`form-control custom-select-arrow w-75 ${
                    status === "cancel"
                      ? "bg-danger text-white "
                      : status === "approve"
                      ? "bg-info text-white"
                      : ""
                  } `}
                  value={status}
                  onChange={handleStatus}
                >
                  <option value="cancel" class="bg-white options-text">
                    Hủy đơn hàng
                  </option>
                  <option value="approve" class="bg-white options-text">
                    Tài xế đã nhận đơn
                  </option>
                </select>
              )}
              {post.status === "approve" && isDriverExist && (
                <select
                  id="orderAction"
                  className={`form-control custom-select-arrow w-75  ${
                    status === "cancel"
                      ? "bg-danger text-white "
                      : status === "approve"
                      ? "bg-secondary text-white"
                      : status === "inprogress"
                      ? "bg-primary text-white "
                      : ""
                  } `}
                  value={status}
                  onChange={handleStatus}
                >
                  <option
                    value="approve"
                    disabled
                    class="bg-white options-text"
                  >
                    Đã nhận đơn
                  </option>
                  <option value="inprogress" className="bg-white options-text">
                    Đang giao hàng
                  </option>

                  <option value="cancel" class="bg-white options-text">
                    Hủy đơn hàng
                  </option>
                </select>
              )}
            </div>

            <div>
              <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
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
                        <select
                          className="w-25 custom-select_input "
                          onChange={handleCityFrom}
                          value={cityFrom}
                          disabled={
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                          } // Kiểm tra trạng thái đơn
                          style={{
                            cursor:
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                                ? "not-allowed"
                                : "auto",
                          }}
                        >
                          {cities.map((city) => (
                            <option value={city.name}>{city.name}</option>
                          ))}
                        </select>
                        <div className="flex-1">
                          <input
                            id="pickupLocation"
                            value={newStartPoint}
                            onChange={handleStartPoint}
                            type="text"
                            className="form-control position-relative"
                            disabled={
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                            } // Kiểm tra trạng thái đơn
                            style={{
                              cursor:
                                post.status === "approve" ||
                                post.status === "inprogress" ||
                                post.status === "cancel" ||
                                (post.status === "wait" && isDriverExist) ||
                                isDealPriceAvailable
                                  ? "not-allowed"
                                  : "auto",
                            }}
                          />
                          {startPointError && (
                            <div className="text-danger position-absolute ">
                              {startPointError}
                            </div>
                          )}
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
                        <select
                          className="w-25 custom-select_input"
                          onChange={handleCityTo}
                          value={cityTo}
                          disabled={
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                          } // Kiểm tra trạng thái đơn
                          style={{
                            cursor:
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                                ? "not-allowed"
                                : "auto",
                          }}
                        >
                          {cities.map((city) => (
                            <option value={city.name}>{city.name}</option>
                          ))}
                        </select>
                        <div className="flex-1">
                          <input
                            id="dropoffLocation"
                            value={newDestination}
                            onChange={handleDestination}
                            type="text"
                            className="form-control position-relative"
                            disabled={
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                            } // Kiểm tra trạng thái đơn
                            style={{
                              cursor:
                                post.status === "approve" ||
                                post.status === "inprogress" ||
                                post.status === "cancel" ||
                                (post.status === "wait" && isDriverExist) ||
                                isDealPriceAvailable
                                  ? "not-allowed"
                                  : "auto",
                            }}
                          />
                          {destinationError && (
                            <div className="text-danger position-absolute ">
                              {destinationError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6 ">
                      <label htmlFor="type" className="font-weight-bold">
                        Loại hàng
                      </label>
                      <input
                        id="type"
                        value={newtitle}
                        type="text"
                        className="form-control position-relative"
                        onChange={handleTitle}
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />
                      {titleError && (
                        <div className="text-danger position-absolute bt-error">
                          {titleError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="weight" className="font-weight-bold">
                        Tổng Trọng Lượng (KG)
                      </label>
                      <input
                        id="weight"
                        value={newWeight}
                        onChange={handleLoad}
                        type="text"
                        className="form-control position-relative"
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />
                      {weightError && (
                        <div className="text-danger position-absolute bt-error">
                          {weightError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="price" className="font-weight-bold ">
                        Giá vận chuyển
                      </label>
                      <input
                        id="price"
                        value={newPrice}
                        onChange={handlePrice}
                        type="text"
                        className="form-control position-relative"
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />
                      {priceError && (
                        <div className="text-danger position-absolute bt-error ">
                          {priceError}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="font-weight-bold">
                          Phương thức thanh toán
                        </label>
                        <select
                          className="form-control"
                          value={paymentMethod}
                          disabled={
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                          }
                          style={{
                            cursor:
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                                ? "not-allowed"
                                : "auto",
                          }}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="" disabled>
                            Chọn phương thức thanh toán
                          </option>
                          <option value="bank_transfer">
                            Chuyển khoản ngân hàng
                          </option>
                          <option value="cash">Tiền mặt</option>
                        </select>
                        {/* {paymentMethodError && (
                          <div className="text-danger position-absolute marginBottom-error">
                            {paymentMethodError}
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className="form-group col-md-12">
                      <label htmlFor="description" className="font-weight-bold">
                        Mô tả đơn hàng
                      </label>
                      <textarea
                        id="description"
                        value={newDetail}
                        onChange={handleNewDetail}
                        className="form-control position-relative"
                        rows="4"
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />

                      {detailError && (
                        <div className="text-danger position-absolute bt-error">
                          {detailError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <h5
                        className="font-weight-bold"
                        style={{ marginTop: "50px" }}
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
                        value={recipientName}
                        onChange={handleReceptionName}
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />
                      {recipentNameError && (
                        <div className="text-danger position-absolute bt-error">
                          {recipentNameError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-6 mt-3">
                      <label htmlFor="phone" className="font-weight-bold">
                        Số điện thoại
                      </label>
                      <input
                        id="phone"
                        type="phone"
                        className="form-control position-relative"
                        value={recipientPhone}
                        onChange={handleReceptionPhone}
                        disabled={
                          post.status === "approve" ||
                          post.status === "inprogress" ||
                          post.status === "cancel" ||
                          (post.status === "wait" && isDriverExist) ||
                          isDealPriceAvailable
                        } // Kiểm tra trạng thái đơn
                        style={{
                          cursor:
                            post.status === "approve" ||
                            post.status === "inprogress" ||
                            post.status === "cancel" ||
                            (post.status === "wait" && isDriverExist) ||
                            isDealPriceAvailable
                              ? "not-allowed"
                              : "auto",
                        }}
                      />

                      {recipentPhoneError && (
                        <div className="text-danger position-absolute bt-error">
                          {recipentPhoneError}
                        </div>
                      )}
                    </div>

                    {!(post.status === "wait" && isDriverExist) && (
                      <>
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
                            value={newFullName}
                            onChange={handleNameChange}
                            disabled={
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                            }
                            style={{
                              cursor:
                                post.status === "approve" ||
                                post.status === "inprogress" ||
                                post.status === "cancel" ||
                                (post.status === "wait" && isDriverExist) ||
                                isDealPriceAvailable
                                  ? "not-allowed"
                                  : "auto",
                            }}
                          />
                          {fullNameError && (
                            <div className="text-danger position-absolute bt-error">
                              {fullNameError}
                            </div>
                          )}
                        </div>

                        <div className="form-group col-md-6 mt-3">
                          <label htmlFor="phone" className="font-weight-bold">
                            Số điện thoại
                          </label>
                          <input
                            id="phone"
                            type="phone"
                            className="form-control position-relative"
                            value={newPhone}
                            onChange={handlePhoneChange}
                            disabled={
                              post.status === "approve" ||
                              post.status === "inprogress" ||
                              post.status === "cancel" ||
                              (post.status === "wait" && isDriverExist) ||
                              isDealPriceAvailable
                            }
                            style={{
                              cursor:
                                post.status === "approve" ||
                                post.status === "inprogress" ||
                                post.status === "cancel" ||
                                (post.status === "wait" && isDriverExist) ||
                                isDealPriceAvailable
                                  ? "not-allowed"
                                  : "auto",
                            }}
                          />
                          {phoneError && (
                            <div className="text-danger position-absolute bt-error">
                              {phoneError}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-70 d-flex justify-content-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-25 cursor-disable"
                    onClick={handleSubmitForm}
                    disabled={
                      isDisable ||
                      (post.status === "inprogress" && !isDriverExist) ||
                      post.status === "cancel"
                    }
                  >
                    <span>Cập nhật</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {post.status === "wait" &&
          driverId === "undefined" &&
          deals.length > 0 && (
            <div className="col-md-4" style={{ right: "20px", width: "300px" }}>
              <div className="card border">
                <div className="card-header">
                  <h3>Tài xế đang thương lượng</h3>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "350px" }}>
                  <ul className="list-group list-group-flush">
                    {deals.map((deal, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="flex-grow-1">
                          <strong>Tài xế: </strong>

                          <span>{deal.driverId.userId.fullName}</span>
                          <br />

                          <strong>Giá: </strong>
                          <span>{deal.dealPrice} VND</span>
                          <br />
                          <strong>Ngày giao dự kiến:</strong>
                          <br />
                          <span className="ml-1">
                            {deal.estimatedHour}&nbsp;-&nbsp;
                            {formatDate(deal.estimatedTime)}
                          </span>
                          <br />
                          <strong>Đánh giá: </strong>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span
                              style={{
                                color: "gold",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {deal.driverId.averageRating > 0 ? (
                                <>
                                  {[
                                    ...Array(
                                      Math.floor(deal.driverId.averageRating)
                                    ),
                                  ].map((_, i) => (
                                    <FaStar key={i} />
                                  ))}
                                  {deal.driverId.averageRating % 1 !== 0 && (
                                    <FaStarHalfAlt />
                                  )}
                                </>
                              ) : (
                                <span>Chưa có đánh giá</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <button
                            className="btn-success btn-sm mb-2"
                            style={{
                              border: "none",
                              width: "90px",
                              padding: "0.2rem 0.5rem",
                            }}
                            onClick={() => handleOpenModal(deal._id)}
                          >
                            Xác nhận
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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
                    Xác nhận đơn hàng
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
                  <p>Bạn có chắc chắn muốn xác nhận tài xế này không?</p>
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
                    className="btn btn-info"
                    onClick={handleConfirmDriver}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Hiển thị tài xế nếu đơn hàng đã được approve */}
        {(post?.status === "approve" || post?.status === "inprogress") &&
          !isDriverExist && (
            <div className="col-md-4">
              <div className="border rounded p-3 shadow-sm ">
                <h3 className="text-center border-bottom pb-2 mb-3 ">
                  Thông tin tài xế
                </h3>
                <div className="contact-info">
                  <div className="contact-avatar-wrapper rounded-circle">
                    {post?.dealId.driverId.userId.avatar && (
                      <img
                        src={post.dealId.driverId.userId.avatar}
                        className="contact-avatar rounded-circle"
                        alt="contact avatar"
                      />
                    )}
                  </div>
                  <div className="contact-details">
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Tài xế:</strong>
                        <span className="text-muted">
                          {post?.dealId.driverId.userId.fullName}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center bg-light mt-2">
                        <strong>Số điện thoại:</strong>
                        <span className="text-muted">
                          {post?.dealId.driverId.userId.phone}
                        </span>
                      </li>
                    </ul>
                    <div className="mt-2 d-flex flex-column align-items-center w-100">
                      <Link
                        to={`/driver/${post.dealId.driverId.userId._id}`}
                        className="btn-success  rounded border-0 text-white w-50 mb-2 "
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {post?.creator && isDriverExist && (
          <div className="col-md-4">
            <div className="border rounded p-3 shadow-sm ">
              <h3 className="text-center border-bottom pb-2 mb-3 ">
                Thông tin người tạo đơn
              </h3>
              <div className="contact-info">
                <div className="contact-avatar-wrapper rounded-circle">
                  {post?.creator.avatar ||
                    (avatarDefault && (
                      <img
                        src={post?.creator.avatar || avatarDefault}
                        className="contact-avatar rounded-circle"
                        alt="contact avatar"
                      />
                    ))}
                </div>
                <div className="contact-details">
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <strong>Tên:</strong>
                      <span className="text-muted">
                        {post?.creator.fullName}
                      </span>
                    </li>
                    {!(post.status === "wait" && isDriverExist) && (
                      <>
                        <li className="list-group-item d-flex justify-content-between align-items-center bg-light mt-2">
                          <strong>Số điện thoại:</strong>
                          <span className="text-muted">
                            {post?.creator.phone}
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {isShowModalCancel && (
          <div
            className="modal fade show  bg-dark bg-opacity-75"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Xác nhận huỷ đơn hàng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseModalCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="">
                    <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                    <p>
                      Nếu đã có tài xế nhận đơn, khi bạn hủy sẽ bị trừ tiền.
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleCloseModalCancel}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={handleConfirmModalCancel}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPostDetail;

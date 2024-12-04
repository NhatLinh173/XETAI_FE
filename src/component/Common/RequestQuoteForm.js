import React, { useEffect, useState } from "react";
import FormInput from "../Common/FormInput";
import useInstanceData from "../../config/useInstanceData";
import axiosInstance from "../../config/axiosConfig";
import axios from "axios";
import { toast } from "react-toastify";
import imgUpload from "../../../src/assets/img/homepage/output-onlinepngtools.png";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";

const RequestQuoteForm = () => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const {
    data,
    loading: instanceLoading,
    error,
    refetch,
  } = useInstanceData(`/auth/user/${userId}`);
  const { phone, fullName, balance } = data || {};
  const [newPhone, setNewPhone] = useState(0);
  const [newFullName, setNewFullName] = useState("");
  const [orderType, setNewOrderType] = useState("");
  const [addressFrom, setNewAddressFrom] = useState("");
  const [addressTo, setNewAddressTo] = useState("");
  const [totalWeight, setNewTotalWeight] = useState("");
  const [cost, setNewCost] = useState("");
  const [orderDescription, setNewoderDescription] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [cities, setCities] = useState([]);
  const [cityFrom, setCityFrom] = useState("");
  const [loading, setLoading] = useState(false);
  const [cityTo, setCityTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [decriptionDriver, setDecriptionDriver] = useState("");

  // các biến lỗi
  const [weightError, setWeightError] = useState("");
  const [currentBalance, setCurrentBalance] = useState(balance || 0);
  const [AddressToChangeError, setAddressToChangeError] = useState("");
  const [AddressFromChangeError, setAddressFromChangeError] = useState("");
  const [OrderTypeChangeError, setOrderTypeChangeError] = useState("");
  const [recipientNameError, setRecipientNameError] = useState("");
  const [newFullNameError, setNewFullNameError] = useState("");
  const [recipientPhoneError, setRecipientPhoneError] = useState("");
  const [newPhoneError, setNewPhoneError] = useState("");
  const [orderDescriptionError, setOrderDescriptionError] = useState("");
  const [decriptionDriverError, setDecriptionDriverError] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [imgs, setImgs] = useState([]);
  const [isDriverExist, setIsDriverExist] = useState(false);
  const driverId = localStorage.getItem("driverId");
  const getCity = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/");

      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  useEffect(() => {
    if (driverId !== "undefined" && driverId) {
      setIsDriverExist(true);
    } else {
      setIsDriverExist(false);
    }
  }, [driverId]);
  useEffect(() => {
    setNewPhone(phone);
    setNewFullName(fullName);
    setCurrentBalance(balance);
    getCity();
  }, [phone, fullName, balance]);

  const handleDescriptionDriverChange = (e) => {
    if (e.target.value.length > 150) {
      setDecriptionDriverError("Trường này giới hạn 150 kí tự");
      setIsDisable(true);
    } else {
      setDecriptionDriverError("");
      setIsDisable(false);
    }
    setDecriptionDriver(e.target.value);
  };
  const handleOrderTypeChange = (e) => {
    if (e.target.value.length > 30) {
      setOrderTypeChangeError("*Trường này giới hạn 50 kí tự");
      setIsDisable(true);
    } else {
      setOrderTypeChangeError("");
      setIsDisable(false);
    }
    setNewOrderType(e.target.value);
  };

  const handleAddressFromChange = (e) => {
    if (e.target.value.length > 60) {
      setAddressFromChangeError("*Trường này giới hạn 60 kí tự");
      setIsDisable(true);
    } else {
      setAddressFromChangeError("");
      setIsDisable(false);
    }
    setNewAddressFrom(e.target.value);
  };
  const handleAddressToChange = (e) => {
    if (e.target.value.length > 60) {
      setAddressToChangeError("*Trường này giới hạn 60 kí tự");
      setIsDisable(true);
    } else {
      setAddressToChangeError("");
      setIsDisable(false);
    }
    setNewAddressTo(e.target.value);
  };
  const handleTotalWeightChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setWeightError("*Trường này chỉ nhập số"); // Cập nhật thông báo lỗi cho trọng lượng
      setIsDisable(true);
    } else {
      setWeightError(""); // Xóa thông báo lỗi nếu nhập đúng
      setIsDisable(false);
    }
    setNewTotalWeight(e.target.value);
  };
  const handleCostChange = (e) => {
    // Lấy giá trị đầu vào và loại bỏ các ký tự không phải số
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setNewCost(""); // Hoặc null, tùy thuộc vào cách bạn muốn xử lý
      setIsDisable(true);
    } else {
      // Định dạng số với dấu phẩy
      const formattedValue = new Intl.NumberFormat().format(value);
      setNewCost(formattedValue);
    }
  };
  const handleOrderDescriptionChange = (e) => {
    if (e.target.value.length > 150) {
      setOrderDescriptionError("*Trường này giới hạn 150 kí tự");
      setIsDisable(true);
    } else {
      setOrderDescriptionError("");
      setIsDisable(false);
    }
    setNewoderDescription(e.target.value);
  };

  const handleRecipientNameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[\p{L}\s]+$/u;

    if (value.trim() === "") {
      setRecipientNameError("");
    } else if (value.length > 30) {
      setRecipientNameError("*Trường này giới hạn 30 kí tự");
      setIsDisable(true);
    } else if (!nameRegex.test(value)) {
      setRecipientNameError("*Trường này không được nhập số");
      setIsDisable(true);
    } else {
      setRecipientNameError("");
      setIsDisable(false);
    }

    setRecipientName(value);
  };
  const handleRecipientPhoneChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setRecipientPhoneError("*Trường này chỉ nhập số"); // Cập nhật thông báo lỗi cho trọng lượng
      setIsDisable(true);
    } else if (value.length > 10) {
      setRecipientPhoneError("*Trường này chỉ nhập 10 số");
      setIsDisable(true);
    } else {
      setRecipientPhoneError(""); // Xóa thông báo lỗi nếu nhập đúng
      setIsDisable(false);
    }
    setRecipientPhone(e.target.value);
  };
  const handleCityFrom = (e) => {
    setCityFrom(e.target.value);
  };
  const handleCityTo = (e) => {
    setCityTo(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value.trim() === "") {
      setNewPhoneError("*Trường này chỉ nhập số"); // Cập nhật thông báo lỗi cho trọng lượng
      setIsDisable(true);
    } else if (value.length > 10) {
      setNewPhoneError("*Trường này chỉ nhập 10 số");
      setIsDisable(true);
    } else {
      setNewPhone(e.target.value);
      setIsDisable(false);
    }
  };
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[\p{L}\s]+$/u;

    if (value === "") {
      // Khi giá trị rỗng, không hiển thị lỗi
      setNewFullNameError("");
      setIsDisable(false);
    } else if (value.length > 30) {
      setNewFullNameError("*Trường này giới hạn 30 kí tự");
      setIsDisable(true);
    } else if (!nameRegex.test(value)) {
      setNewFullNameError("Trường này không được nhập số");
      setIsDisable(true);
    } else {
      setNewFullNameError("");
      setIsDisable(false);
    }

    setNewFullName(value);
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    if (isDriverExist) {
      // Nếu role là tài xế, chỉ cho phép một ảnh
      if (filePreviews.length > 1) {
        toast.error("Tài xế chỉ được chọn một ảnh.");
        return;
      }
      // Nếu đã có ảnh, thay thế bằng ảnh mới
      setImgs(filePreviews);
    } else {
      // Nếu không phải tài xế, giới hạn tối đa 3 ảnh
      if (files.length + imgs.length > 3) {
        toast.error("Bạn chỉ được chọn 3 ảnh.");
        return;
      }
      setImgs((prevImgs) => [...prevImgs, ...filePreviews]);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImgs = imgs.filter((_, i) => i !== index);
    setImgs(updatedImgs);
  };
  // useEffect(() => {
  //   if (imgs.length === 0) {
  //     setIsDisable(true);
  //   } else {
  //     setIsDisable(false);
  //   }
  // }, [imgs]);
  const handleSubmitDriver = async (e) => {
    e.preventDefault();
    console.log("Ảnh đã chọn:", imgs);
    if (!imgs || imgs.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh!");
      return; // Ngăn không cho gửi dữ liệu nếu imgs trống
    }
    const formData = new FormData();
    imgs.forEach((img) => {
      console.log("Đang thêm ảnh vào FormData:", img.file);
      formData.append("images", img.file);
    });
    formData.append("creatorId", driverId);
    formData.append("startCity", cityFrom);
    formData.append("destinationCity", cityTo);

    formData.append("description", decriptionDriver);

    try {
      const response = await axiosInstance.post("/driverpost", formData);
      if (response.status === 200) {
        toast.success("Đăng bài thành công");
        setCityFrom("");
        setCityTo("");
        setDecriptionDriver("");
        setImgs("");
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Vui lòng điền đầy đủ thông tin");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgs || imgs.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh!");
      return; // Ngăn không cho gửi dữ liệu nếu imgs trống
    }
    const formData = new FormData();
    imgs.forEach((img) => {
      formData.append("images", img.file);
    });
    formData.append("creator", userId);
    formData.append("phone", newPhone);
    formData.append("fullname", newFullName);
    formData.append("title", orderType);
    formData.append("startPoint", addressFrom);
    formData.append("destination", addressTo);
    formData.append("load", totalWeight);
    formData.append("price", cost);
    formData.append("detail", orderDescription);
    formData.append("startPointCity", cityFrom);
    formData.append("destinationCity", cityTo);
    formData.append("recipientName", recipientName);
    formData.append("recipientPhone", recipientPhone);
    formData.append("paymentMethod", paymentMethod);

    try {
      setLoading(true);
      const response = await axiosInstance.post("/posts", formData);

      if (response.status === 201) {
        toast.success("Tạo đơn hàng thành công");
        setNewOrderType("");
        setNewAddressFrom("");
        setNewAddressTo("");
        setNewTotalWeight("");
        setNewoderDescription("");
        setRecipientName("");
        setRecipientPhone("");
        setCityFrom("");
        setCityTo("");
        setWeightError("");
        setNewCost("");
        setImgs("");
        setPaymentMethod("");
        refetch();
        history.pushState("/");
      }
      if (response.status === 402) {
        toast.error(
          "Số dư tài khoản không đủ để đăng bài! Vui lòng nạp thêm tiền để đăng bài"
        );
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Vui lòng điền đầy đủ thông tin");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <>
      <section id="request_quote_form_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12 col-md-12 col-12">
              <form id="request_form">
                <div className="row">
                  <div className="col-lg-12">
                    {!isDriverExist && (
                      <div className="heading_quote ">
                        <h2>Đơn Hàng</h2>
                      </div>
                    )}
                    {isDriverExist && (
                      <div className="heading_quote ">
                        <h2>Đăng bài</h2>
                      </div>
                    )}
                  </div>
                  {imgs && imgs.length > 0 && (
                    <div
                      className={`d-flex image-form align-items-center mb-3 ${
                        imgs.length === 1
                          ? "justify-content-center"
                          : imgs.length === 2
                          ? "justify-content-center w-100"
                          : "justify-content-between w-100"
                      }`}
                    >
                      {imgs.map((img, index) => (
                        <div
                          className={`position-relative border rounded-12 p-3 d-inline-block ${
                            imgs.length === 1 ? "w-100" : ""
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className={`rounded-12  ${
                              imgs.length === 1 ? "w-100" : ""
                            }`}
                          />
                          <IoCloseCircleOutline
                            className={`position-absolute ${
                              imgs.length === 1 ? "delete-img" : "delete-imgs"
                            }`}
                            onClick={() => handleDeleteImage(index)} // Hàm để xóa ảnh
                          />
                        </div>
                      ))}
                      <div className="text-center">
                        <input
                          className="input-custom"
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                        />
                        <label
                          className="border rounded-12 p-3 pointer img-upload"
                          htmlFor="file-upload" // Sửa từ "for" thành "htmlFor"
                        >
                          <img src={imgUpload} alt="upload" />
                        </label>
                        <p className="font-weight-bold">Tải ảnh lên</p>
                      </div>
                    </div>
                  )}
                  {imgs.length === 0 && (
                    <div className="d-flex justify-content-center flex-column align-items-center">
                      <input
                        className="input-custom"
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label
                        className="border rounded-12 p-3 pointer w-50"
                        htmlFor="file-upload" // Sửa từ "for" thành "htmlFor"
                      >
                        <img src={imgUpload} alt="upload" />
                      </label>
                      <p className="font-weight-bold">Tải ảnh lên</p>
                    </div>
                  )}

                  {!isDriverExist && (
                    <div class="container d-flex justify-content-center mb-3">
                      <div className="col-lg-6 d-flex w-100 addressFrom-input  pl-0">
                        <div className="form-group align-self-end">
                          <label className="font-weight-bold">
                            Địa chỉ nhận hàng
                          </label>
                          <select
                            className="form-control first_null"
                            onChange={handleCityFrom}
                            value={cityFrom}
                          >
                            <option value="" disabled>
                              Chọn Tỉnh/Thành
                            </option>
                            {cities.map((city) => (
                              <option value={city.name}>{city.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 custom-input">
                          <FormInput
                            tag={"input"}
                            type={"text"}
                            name={"departure"}
                            id={"departure"}
                            classes={
                              "form-control align-self-end position-relative"
                            }
                            placeholder={"Địa Chỉ Nhận Hàng"}
                            label="Địa Chỉ Nhận Hàng"
                            value={addressFrom}
                            onChange={handleAddressFromChange}
                          />
                          {AddressFromChangeError && (
                            <div className="text-danger position-absolute bottom-error">
                              {AddressFromChangeError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 d-flex w-100 addressTo-input pr-0">
                        <div className="form-group align-self-end">
                          <label className="font-weight-bold">
                            Địa chỉ giao hàng
                          </label>
                          <select
                            className="form-control first_null"
                            onChange={handleCityTo}
                            value={cityTo}
                          >
                            <option value="" disabled>
                              Chọn Tỉnh/Thành
                            </option>
                            {cities.map((city) => (
                              <option value={city.name}>{city.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1 custom-input">
                          <FormInput
                            tag={"input"}
                            type={"text"}
                            name={"city"}
                            id={"city"}
                            classes={"form-control position-relative"}
                            placeholder={"Địa Chỉ Giao Hàng"}
                            label="Địa Chỉ Giao Hàng"
                            value={addressTo}
                            onChange={handleAddressToChange}
                          />
                          {AddressToChangeError && (
                            <div className="text-danger position-absolute bottom-error">
                              {AddressToChangeError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {isDriverExist && (
                    <div className="container d-flex justify-content-center mb-3">
                      <div className="row w-100 justify-content-between">
                        <div className="col-lg-5 d-flex addressFrom-input pl-0">
                          <div className="form-group align-self-end w-100">
                            <label className="font-weight-bold">Điểm đi</label>
                            <select
                              className="form-control"
                              onChange={handleCityFrom}
                              value={cityFrom}
                            >
                              <option value="" disabled>
                                Chọn Tỉnh/Thành
                              </option>
                              {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-5 d-flex addressTo-input pr-0">
                          <div className="form-group align-self-end w-100">
                            <label className="font-weight-bold">Điểm đến</label>
                            <select
                              className="form-control"
                              onChange={handleCityTo}
                              value={cityTo}
                            >
                              <option value="" disabled>
                                Chọn Tỉnh/Thành
                              </option>
                              {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <FormInput
                        tag={"input"}
                        type={"text"}
                        name={"orderType"}
                        id={"orderType"}
                        classes={"form-control "}
                        placeholder={"Loại Hàng"}
                        label="Loại Hàng"
                        value={orderType}
                        onChange={handleOrderTypeChange}
                      />
                      {OrderTypeChangeError && (
                        <div className="text-danger   position-absolute marginBottom-error">
                          {OrderTypeChangeError}
                        </div>
                      )}{" "}
                    </div>
                  )}

                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <FormInput
                        tag={"input"}
                        type={"text"}
                        name={"weight"}
                        id={"weight"}
                        classes={"form-control"}
                        placeholder={"Tổng Trọng Lượng (KG)"}
                        label="Tổng Trọng Lượng (KG)"
                        value={totalWeight}
                        onChange={handleTotalWeightChange}
                      />
                      {weightError && (
                        <div className="text-danger position-absolute marginBottom-error">
                          {weightError}
                        </div>
                      )}{" "}
                      {/* Hiển thị thông báo lỗi cho trọng lượng */}
                    </div>
                  )}
                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <FormInput
                        tag={"input"}
                        type={"text"}
                        name={"bill"}
                        id={"bill"}
                        classes={"form-control"}
                        placeholder={"Giá vận chuyển"}
                        label="Giá vận chuyển (VND)"
                        value={cost}
                        onChange={handleCostChange}
                      />
                    </div>
                  )}

                  {isDriverExist && (
                    <div className="col-lg-12">
                      <FormInput
                        tag={"textarea"}
                        type={"text"}
                        name={"text"}
                        classes={"form-control"}
                        placeholder={"Nhập nội dung"}
                        label=" Nội dung  "
                        value={decriptionDriver}
                        onChange={handleDescriptionDriverChange}
                      />
                      {decriptionDriverError && (
                        <div className="text-danger position-absolute marginBottom-error">
                          {decriptionDriverError}
                        </div>
                      )}{" "}
                    </div>
                  )}
                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="font-weight-bold">
                          Phương thức thanh toán
                        </label>
                        <select
                          className="form-control"
                          value={paymentMethod}
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
                        {paymentMethodError && (
                          <div className="text-danger position-absolute marginBottom-error">
                            {paymentMethodError}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!isDriverExist && (
                    <div className="col-lg-12">
                      <FormInput
                        tag={"textarea"}
                        type={"text"}
                        name={"text"}
                        classes={"form-control"}
                        placeholder={"Mô Tả Đơn Hàng"}
                        label="Mô Tả Đơn Hàng  "
                        value={orderDescription}
                        onChange={handleOrderDescriptionChange}
                      />
                      {orderDescriptionError && (
                        <div className="text-danger position-absolute marginBottom-error">
                          {orderDescriptionError}
                        </div>
                      )}{" "}
                    </div>
                  )}
                  {!isDriverExist && (
                    <div className="col-lg-12">
                      <div className="heading_quote arae_top">
                        <h3>Thông Tin Người Nhận</h3>
                      </div>
                    </div>
                  )}

                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <FormInput
                        tag={"input"}
                        type={"text"}
                        name={"receptionName"}
                        classes={"form-control"}
                        placeholder={"Họ và Tên"}
                        label="Họ và Tên"
                        value={recipientName}
                        onChange={handleRecipientNameChange}
                      />
                      {recipientNameError && (
                        <div className="text-danger position-absolute marginBottom-error">
                          {recipientNameError}
                        </div>
                      )}
                    </div>
                  )}

                  {!isDriverExist && (
                    <div className="col-lg-6">
                      <FormInput
                        tag={"input"}
                        type={"text"}
                        name={"number"}
                        classes={"form-control"}
                        placeholder={"Số Điện Thoại"}
                        label="Số Điện Thoại"
                        value={recipientPhone}
                        onChange={handleRecipientPhoneChange}
                      />
                      {recipientPhoneError && (
                        <div className="text-danger position-absolute marginBottom-error">
                          {recipientPhoneError}
                        </div>
                      )}
                    </div>
                  )}

                  {!isDriverExist && (
                    <>
                      <div className="col-lg-12">
                        <div className="heading_quote arae_top">
                          <h3>Thông Tin Người Đặt</h3>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <FormInput
                          tag={"input"}
                          type={"text"}
                          name={"lname"}
                          classes={"form-control"}
                          placeholder={"Họ và Tên"}
                          label="Họ và Tên"
                          value={newFullName}
                          onChange={handleFullNameChange}
                        />
                        {newFullNameError && (
                          <div className="text-danger position-absolute marginBottom-error">
                            {newFullNameError}
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6">
                        <FormInput
                          tag={"input"}
                          type={"text"}
                          name={"number"}
                          classes={"form-control"}
                          placeholder={"Số Điện Thoại"}
                          label="Số Điện Thoại"
                          value={newPhone}
                          onChange={handlePhoneChange}
                        />
                        {newPhoneError && (
                          <div className="text-danger position-absolute marginBottom-error">
                            {newPhoneError}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="col-lg-12">
                    <div className="quote_submit_button d-flex justify-content-center">
                      <button
                        className={`btn ${
                          isDisable || loading
                            ? "btn-secondary cursor-disable"
                            : "btn-theme"
                        }`}
                        onClick={
                          isDriverExist ? handleSubmitDriver : handleSubmit
                        }
                        disabled={isDisable || loading}
                      >
                        {loading
                          ? isDriverExist
                            ? "Đang đăng ..."
                            : "Đang tạo ..."
                          : isDriverExist
                          ? "Đăng bài"
                          : "Tạo đơn"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RequestQuoteForm;

import React, { useEffect } from "react";
import "../../assets/css/paymentStatus.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

const PaymentSuccess = () => {
  const history = useHistory();
  const location = useLocation();
  const handleBackToHome = () => {
    history.push("/");
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get("status");
    const orderCode = queryParams.get("orderCode");

    console.log("Status:", status, "orderCode:", orderCode);
    if (orderCode) {
      sessionStorage.setItem("orderCode", orderCode);
    }
    const token = localStorage.getItem("accessToken");
    const fetchPaymentCallback = async () => {
      try {
        const response = await axiosInstance.post(
          "/payment/callback-success",
          {
            status,
            orderCode,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Response Data:", response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentCallback();
  }, [location.search]);
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="message-box _success">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
            <h2>Thanh toán của bạn đã thành công</h2>
            <p>Cảm ơn bạn đã thanh toán.</p>
            <button className="btn btn-primary mt-4" onClick={handleBackToHome}>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

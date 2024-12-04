import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";

const DriverCard = () => {
  const history = useHistory();
  const [driver, setDriver] = useState(null);
  const userId = localStorage.getItem("userId");
  const [driverId, setDriverId] = useState(null);
  const [driverFavorite, setDriverFavorite] = useState(null);

  const handleViewDetails = () => {
    if (driver && driverId) {
      history.push(`/driver/${driverId}`);
    }
  };

  useEffect(() => {
    const getDriver = async () => {
      try {
        const response = await axiosInstance.get(`/driver/${userId}`);
        if (response.status === 200 && response.data.favorite) {
          setDriver(response.data.favorite.driverId);
          setDriverFavorite(response.data.favorite.driverId._id);
          setDriverId(response.data.favorite.driverId.userId._id);
        } else {
          toast.error("Lấy thông tin tài xế thất bại");
        }
      } catch (error) {
        console.error("Error getting driver:", error);
      }
    };
    if (userId) {
      getDriver();
    }
  }, [userId]);

  const handleRemoveFavoriteDriver = async () => {
    try {
      const response = await axiosInstance.post("/favorites/remove", {
        driverId: driverFavorite,
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

  return (
    <div className="card mb-4 driver-card">
      <div className="row g-0">
        {driver ? (
          <>
            <div className="col-md-3 d-flex align-items-center">
              <img
                src={driver.userId.avatar}
                className="img-fluid"
                alt={driver.userId.fullName}
              />
            </div>
            <div className="col-md-5 d-flex flex-column justify-content-center">
              <h5 className="card-title">{driver.userId.fullName}</h5>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-end justify-content-center">
              <div className="vertical-line"></div>
              <button
                className="btn btn-theme mb-2 w-50"
                onClick={handleRemoveFavoriteDriver}
              >
                Bỏ thích
              </button>
              <button className="btn btn-link w-50" onClick={handleViewDetails}>
                Xem chi tiết
              </button>
            </div>
          </>
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              fontSize: "18px",
              color: "#333",
            }}
          >
            Không có tài xế yêu thích.
          </p>
        )}
      </div>
    </div>
  );
};

export default DriverCard;

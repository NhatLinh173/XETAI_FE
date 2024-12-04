import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/axiosConfig";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
const DriverDetail = () => {
  const [driver, setDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { driverId } = useParams();

  useEffect(() => {
    const getInfoDriver = async () => {
      try {
        const response = await axiosInstance.get(`/driver/details/${driverId}`);
        setDriver(response.data.driverDetails);
        console.log("Driver info:", response.data.driverDetails);
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };
    if (driverId) {
      getInfoDriver();
    }
  }, [driverId]);

  const handleShowDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const getStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<i key={i} className="fa fa-star star-filled"></i>);
      } else {
        stars.push(<i key={i} className="fa fa-star star-empty"></i>);
      }
    }
    return stars;
  };

  if (!driver) {
    return <div>Driver not found</div>;
  }

  return (
    <div className="wrapper container pb-5">
      <div className="row">
        {/* Left Side: Driver and Vehicle Info */}
        <div className="col-md-8">
          <div className="border rounded p-3 shadow-sm">
            {/* Driver Information */}
            <div className="d-flex border-bottom pb-3 mb-3">
              <img
                src={driver.avatar || avatarDefault}
                alt="vehicle"
                className="img-fluid rounded"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <div className="ml-3 d-flex flex-column justify-content-center">
                <h4 className="mb-2">{driver.fullName}</h4>
                <div className="mb-2">{getStars(driver.averageRating)}</div>
              </div>
            </div>
            <div>
              <h5 className="font-weight-bold" style={{ marginBottom: "15px" }}>
                Thông tin liên hệ
              </h5>
              <form>
                <div className="border rounded p-3 shadow-sm">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        defaultValue={driver.email}
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="phone-number">Số điện thoại</label>
                      <input
                        id="phone-number"
                        defaultValue={driver.phone}
                        type="tel"
                        className="form-control"
                        placeholder="Số điện thoại"
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="address">Địa chỉ</label>
                      <input
                        id="address"
                        defaultValue={driver.address}
                        type="text"
                        className="form-control"
                        placeholder="Địa chỉ"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="mb-4">
              <h4
                className="font-weight-bold"
                style={{ marginBottom: "20px", marginTop: "20px" }}
              >
                Thông tin xe
              </h4>
              {driver.vehicles && driver.vehicles.length > 0 ? (
                driver.vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 mb-3 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p>
                        <strong>Tên xe:</strong> {vehicle.vehicleName}
                      </p>
                      <p>
                        <strong>Biển số:</strong> {vehicle.vehicleRegistration}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleShowDetails(vehicle)}
                    >
                      Xem thêm
                    </Button>
                  </div>
                ))
              ) : (
                <p>Không có thông tin xe</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Vehicle Details */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết xe</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            {selectedVehicle && (
              <div>
                <img
                  src={selectedVehicle.vehicleImage}
                  alt="vehicle"
                  className="img-fluid rounded mb-3"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
                <p>
                  <strong>Loại xe:</strong> {selectedVehicle.vehicleType}
                </p>
                <p>
                  <strong>Tên xe:</strong> {selectedVehicle.vehicleName}
                </p>
                <p>
                  <strong>Biển số:</strong>{" "}
                  {selectedVehicle.vehicleRegistration}
                </p>
                <p>
                  <strong>Trọng tải:</strong> {selectedVehicle.payload}
                </p>
                <p>
                  <strong>Đăng kiểm xe:</strong>
                </p>
                {selectedVehicle.registerVehicleImg && (
                  <div className="mt-3">
                    <img
                      src={selectedVehicle.registerVehicleImg}
                      alt="Vehicle Registration"
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Right Side: Driver Avatar and Additional Info */}
        <div className="col-md-4">
          <div className="border rounded p-3 shadow-sm">
            <div className="d-flex align-items-center border-bottom pb-3">
              <img
                src={driver.avatar || avatarDefault}
                className="border rounded mr-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                alt="driver avatar"
              />
              <div>
                <h6 className="text-muted">Tài xế</h6>
                <h5>{driver.fullName}</h5>
                <p className="text-muted">{driver.businessName}</p>
              </div>
            </div>

            <div className="pt-3 statistics-section">
              <h6>averageRating</h6>
              <div className="statistics-item">
                <p className="stat-label">Chuyến đi tuần này:</p>
                <p className="stat-value">{driver.tripsThisWeek}</p>
              </div>
              <div className="statistics-item">
                <p className="stat-label">Chuyến đi tháng này:</p>
                <p className="stat-value">{driver.tripsThisMonth}</p>
              </div>
              <div className="statistics-item">
                <p className="stat-label">Đánh giá trung bình:</p>
                <p className="stat-value">{driver.averageRating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;

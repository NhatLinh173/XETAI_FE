import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import avatarDefault from "../../../assets/img/icon/avatarDefault.jpg";
import * as XLSX from "xlsx";

const DriverInfo = ({ userInfor }) => (
  <header className="bg-light p-4 rounded mb-4 border">
    <div className="driver-info d-flex align-items-center">
      <img
        src={userInfor.avatar || avatarDefault}
        alt="Ảnh đại diện tài xế"
        className="avatar me-3"
      />
      <div>
        <h2>{userInfor.fullName}</h2>
        <p className="text-muted">Tài xế</p>
      </div>
    </div>
  </header>
);

const StatCard = ({ title, value }) => (
  <div className="col-md-3">
    <div className="stat-card card p-1 text-center border">
      <h2 className="h6">{title}</h2>
      <p className="fw-bold">{value}</p>
    </div>
  </div>
);

const VehicleList = ({ vehicles = [], onVehicleClick }) => (
  <section className="vehicles mb-4 border p-3 rounded">
    <h2>Phương tiện ({vehicles.length})</h2>
    {vehicles.length === 0 ? (
      <p className="text-muted">Chưa có phương tiện nào được đăng ký.</p>
    ) : (
      <div className="d-flex flex-wrap gap-3" style={{ marginTop: "20px" }}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="vehicle-card d-flex flex-column align-items-center p-3 border rounded"
            style={{ width: "250px", cursor: "pointer" }}
            onClick={() => onVehicleClick(vehicle)}
          >
            <img
              src={vehicle.imageCar}
              alt={vehicle.nameCar}
              className="vehicle-image img-fluid mb-2"
              style={{ height: "180px", objectFit: "cover" }}
            />
            <h3 className="h6 text-center">{vehicle.name}</h3>
            <p className="text-center">Biển số: {vehicle.licensePlate}</p>
          </div>
        ))}
      </div>
    )}
  </section>
);

const TransactionList = ({ transactions = [], userInfor }) => {
  const getDescription = (type) => {
    switch (type) {
      case "POST_PAYMENT":
        return "Trả phí đăng bài";
      case "DEPOSIT":
        return "Nạp tiền";
      case "CANCEL_ORDER":
        return "Hủy Nhận chuyến";
      default:
        return "Không xác định";
    }
  };
  const getStatus = (status) => {
    switch (status) {
      case "PAID":
        return "Thành công";
      case "PENDING":
        return "Đang chờ xử lý";
      case "FAILED":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const handleExportExcel = () => {
    if (!userInfor) {
      console.log("Không có thông tin người dùng để xuất");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      transactions.map((transaction) => ({
        "ID người dùng": userInfor._id,
        "Tên người dùng": userInfor.fullName,
        Ngày: new Date(transaction.createdAt).toLocaleDateString(),
        "Mô tả": getDescription(transaction.type),
        "Số tiền": transaction.amount.toLocaleString() + " VNĐ",
        "Trạng thái": getStatus(transaction.status),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch sử giao dịch");
    XLSX.writeFile(wb, `lich_su_giao_dich_${userInfor.email}.xlsx`);
  };

  return (
    <section
      className="transactions mb-4 border p-3 rounded"
      style={{ marginBottom: "30px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h2>Lịch sử giao dịch</h2>
        <button className="btn btn-primary" onClick={handleExportExcel}>
          Xuất Excel
        </button>
      </div>
      <div className="table-responsive" style={{ marginTop: "20px" }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td>{getDescription(transaction.type)}</td>
                  <td>{transaction.amount.toLocaleString()} VNĐ</td>
                  <td>{getStatus(transaction.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const VehicleModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <div>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
      ></div>

      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", zIndex: 1050 }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h4">{vehicle.nameCar}</h2>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body d-flex align-items-center">
              <div>
                <p>
                  <strong>Biển số xe:</strong> {vehicle.licensePlate}
                </p>
                <p>
                  <strong>Đăng kiểm gần nhất:</strong>{" "}
                  {new Date(vehicle.registrationDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p>
                  <strong>Thời gian hết đăng kiểm:</strong>{" "}
                  {new Date(vehicle.expirationDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DriverDetails = () => {
  const [userInfor, setUserInfor] = useState([]);
  const [transactionsUser, setTransactionsUser] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [car, setCar] = useState([]);
  const [driverData, setDriverData] = useState({
    name: "",
    vehicles: [],
    transactions: [],
    totalIncome: 0,
    totalTripsWeek: 0,
    totalTripsMonth: 0,
  });
  const [userId, setUserId] = useState(null);
  const { driverId } = useParams();

  useEffect(() => {
    const fetchDriverAndCarData = async () => {
      try {
        const driverResponse = await axiosInstance.get(
          `/driver/getDriver/${driverId}`
        );
        setUserId(driverResponse.data.userId);
        setDriverData(driverResponse.data);

        // Sau khi userId đã được gán, gọi API getCar
        const carResponse = await axiosInstance.get(
          `/car/driver/${driverId}/status`
        );
        setCar(carResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tài xế hoặc thông tin xe:", error);
      }
    };

    fetchDriverAndCarData();
  }, [driverId]);

  useEffect(() => {
    const fetchInforUser = async () => {
      try {
        const response = await axiosInstance.get(`/auth/user/${userId}`);
        console.log("Thông tin người dùng:", response.data);
        setUserInfor(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchInforUser();
  }, [userId]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axiosInstance.get(`/auth/transaction/${userId}`);
        setTransactionsUser(response.data.transactions);
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    if (userId) {
      getTransactions();
    }
  }, [userId]);

  return (
    <div className="container container-driver-details mt-4">
      <DriverInfo userInfor={userInfor} />

      <section className="stats row g-3 mb-4">
        <StatCard
          title="Tổng thu nhập"
          value={
            driverData.balance
              ? driverData.balance.toLocaleString() + " VNĐ"
              : "0 VNĐ"
          }
        />
        <StatCard
          title="Chuyến trong tuần"
          value={driverData.tripsThisWeek || 0}
        />
        <StatCard
          title="Chuyến trong tháng"
          value={driverData.tripsThisMonth || 0}
        />
        <StatCard
          title="Tổng số chuyến"
          value={driverData.tripsCompleted || 0}
        />
      </section>

      <VehicleList vehicles={car || []} onVehicleClick={setSelectedVehicle} />

      <TransactionList transactions={transactionsUser} userInfor={userInfor} />

      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};

export default DriverDetails;

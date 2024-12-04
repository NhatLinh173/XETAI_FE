import React, { useState } from "react";
import MapView from "./MapView";
import FormInput from "../Common/FormInput";
import axios from "axios";

const TrackShipment = () => {
  const [orderCode, setOrderCode] = useState("");
  const [shipmentData, setShipmentData] = useState(null);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleOrderCodeChange = (e) => {
    setOrderCode(e.target.value);
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!orderCode) {
      alert("Vui lòng nhập mã đơn hàng.");
      return;
    }

    try {
      setError("");
      const response = await axios.get(
        `http://localhost:3005/tracking/driver-location/${orderCode}`
      );

      const { startPoint, destination, startPointCity, destinationCity } =
        response.data;

      if (startPoint && destination && startPointCity && destinationCity) {
        setShipmentData({
          startLocation: `${startPoint}, ${startPointCity}`,
          endLocation: `${destination}, ${destinationCity}`,
          orderCode, // Gửi mã đơn hàng sang MapView
        });
        setShowMap(true);
      } else {
        setError(
          "Không tìm thấy vị trí đơn hàng. Vui lòng kiểm tra lại mã đơn hàng."
        );
        setShowMap(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error.message);
      setError("Có lỗi xảy ra khi truy vấn dữ liệu. Vui lòng thử lại sau.");
      setShowMap(false);
    }
  };

  return (
    <section id="track_shipment_area">
      <div className="container">
        <form onSubmit={handleTrack}>
          <FormInput
            tag={"input"}
            type={"text"}
            name={"orderCode"}
            classes={"form-control"}
            placeholder={"Nhập mã đơn hàng"}
            label={"Mã Đơn Hàng"}
            value={orderCode}
            onChange={handleOrderCodeChange}
          />

          <div
            className="track_now_btn"
            style={{ marginTop: "15px", marginBottom: "20px" }}
          >
            <button type="submit" className="btn btn-theme">
              Theo dõi ngay
            </button>
          </div>
        </form>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {showMap && shipmentData && (
          <div style={{ height: "800px" }}>
            <MapView
              startLocation={shipmentData.startLocation}
              endLocation={shipmentData.endLocation}
              orderCode={shipmentData.orderCode}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackShipment;

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { io } from "socket.io-client";

// Xóa các icon mặc định
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Tạo custom icon cho Marker bằng FaMapMarkerAlt
const customMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <FaMapMarkerAlt style={{ color: "red", fontSize: "24px" }} />
  ),
  className: "custom-icon",
  iconSize: [24, 24],
});

const MapView = ({ startLocation, endLocation, orderCode }) => {
  const [driverCoords, setDriverCoords] = useState(null);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [socket, setSocket] = useState(null);

  const goongApiKey = "BHii3IpyB5bqgvtFNjjfLwIJGkoqpVzoo48UGbsP";

  const getCoordinates = async (location) => {
    const url = `https://rsapi.goong.io/geocode?address=${location}&api_key=${goongApiKey}`;
    try {
      const response = await fetch(url);
      const results = await response.json();
      if (results.results && results.results.length > 0) {
        const locationData = results.results[0].geometry.location;
        return [locationData.lat, locationData.lng];
      }
      throw new Error("Không tìm thấy tọa độ.");
    } catch (error) {
      console.error("Lỗi khi lấy tọa độ:", error.message);
      return null;
    }
  };

  const getRoute = async (startCoordinates, endCoordinates) => {
    const url = `https://rsapi.goong.io/Direction?origin=${startCoordinates[0]},${startCoordinates[1]}&destination=${endCoordinates[0]},${endCoordinates[1]}&api_key=${goongApiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return route.legs[0].steps.map((step) => [
          step.start_location.lat,
          step.start_location.lng,
        ]);
      }
      throw new Error("Không thể lấy tuyến đường.");
    } catch (error) {
      console.error("Lỗi khi lấy tuyến đường:", error.message);
      return [];
    }
  };

  const sendDriverLocation = async (latitude, longitude) => {
    if (socket) {
      socket.emit("updateDriverLocation", {
        orderCode,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
      console.log(
        `Vị trí tài xế đã được gửi đến server WebSocket: ${latitude}, ${longitude}`
      );
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverCoords([latitude, longitude]);
          sendDriverLocation(latitude, longitude);
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation không được hỗ trợ trên trình duyệt này.");
    }
  }, [socket]);

  useEffect(() => {
    const socketInstance = io("ws://localhost:3005");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("WebSocket đã kết nối");
      socketInstance.emit("TRACK_ORDER", { orderCode });
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Lỗi khi kết nối WebSocket:", error);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [orderCode]);

  useEffect(() => {
    const fetchInitialLocation = async () => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverCoords([latitude, longitude]);
            sendDriverLocation(latitude, longitude);
          },
          (error) => {
            console.error("Lỗi lấy vị trí:", error.message);
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        console.error("Geolocation không được hỗ trợ trên trình duyệt này.");
      }
    };

    fetchInitialLocation();

    const intervalId = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverCoords([latitude, longitude]);
            sendDriverLocation(latitude, longitude);
          },
          (error) => {
            console.error("Lỗi lấy vị trí:", error.message);
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    }, 3600000);

    return () => {
      clearInterval(intervalId);
    };
  }, [socket, orderCode]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (startLocation && endLocation) {
        const startCoords = await getCoordinates(startLocation);
        const endCoords = await getCoordinates(endLocation);
        setStartCoords(startCoords);
        setEndCoords(endCoords);

        if (startCoords && endCoords) {
          const route = await getRoute(startCoords, endCoords);
          setRouteCoordinates(route);
        }
      }
    };

    fetchCoordinates();
  }, [startLocation, endLocation]);

  return (
    <div style={{ height: "800px", width: "100%" }}>
      <MapContainer
        center={driverCoords || startCoords || [15.8801, 108.338]}
        zoom={10}
        style={{ height: "800px", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {startCoords && (
          <Marker position={startCoords} icon={customMarkerIcon}>
            <Popup>Điểm bắt đầu: {startLocation}</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker position={endCoords} icon={customMarkerIcon}>
            <Popup>Điểm kết thúc: {endLocation}</Popup>
          </Marker>
        )}
        {driverCoords && (
          <Marker position={driverCoords} icon={customMarkerIcon}>
            <Popup>Vị trí tài xế hiện tại</Popup>
          </Marker>
        )}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;

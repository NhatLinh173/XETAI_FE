import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistical = ({ driverId }) => {
  const [statistics, setStatistics] = useState({
    tripsThisWeek: 0,
    tripsThisMonth: 0,
    earnings: 0,
  });
  const [timeRange, setTimeRange] = useState("Hôm nay");
  const [labels, setLabels] = useState([]);
  const [lineDataPoints, setLineDataPoints] = useState([]);
  const [tripDataPoints, setTripDataPoints] = useState([]);

  const timeRangeMapping = {
    "Hôm qua": "yesterday",
    "Hôm nay": "today",
    "Tuần này": "week",
    "Tháng này": "month",
    "Tháng trước": "lastMonth",
    "Năm này": "year",
    "Năm trước": "lastYear",
  };

  const fetchStatistics = async (range) => {
    try {
      const mappedRange = timeRangeMapping[range] || range;
      const response = await axios.get(
        `https://xetai-be.vercel.app/driver/${driverId}/statistics?range=${range}`
      );
      const data = response.data;
      setStatistics({
        tripsThisWeek: data.tripsThisWeek || 0,
        tripsThisMonth: data.tripsThisMonth || 0,
        earnings: data.balance || 0,
      });

      const selectedData = data[mappedRange];

      if (selectedData) {
        let newLabels = [];
        let newTripDataPoints = [];
        let newLineDataPoints = [];

        switch (mappedRange) {
          case "yesterday":
          case "today":
            newLabels = Array.from(
              { length: 24 },
              (_, i) => `${i.toString().padStart(2, "0")}:00`
            );
            newTripDataPoints = newLabels.map((hour) => {
              const hourData = selectedData.find((item) => item.hour === hour);
              return hourData ? hourData.trips : 0;
            });

            newLineDataPoints = newLabels.map((hour) => {
              const hourData = selectedData.find((item) => item.hour === hour);
              return hourData ? hourData.earnings : 0;
            });
            break;

          case "week":
            const daysOfWeek = [
              "Thứ 2",
              "Thứ 3",
              "Thứ 4",
              "Thứ 5",
              "Thứ 6",
              "Thứ 7",
              "CN",
            ];
            const currentDate = new Date();
            const currentDay = currentDate.getDay(); // 0 (Chủ Nhật) đến 6 (Thứ Bảy)
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() - currentDay + 1); // Lấy Thứ Hai đầu tuần

            newLabels = daysOfWeek;
            newTripDataPoints = daysOfWeek.map((day, index) => {
              const targetDate = new Date(weekStartDate);
              targetDate.setDate(weekStartDate.getDate() + index);

              const formattedDate = `${String(targetDate.getDate()).padStart(
                2,
                "0"
              )}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`;

              const dayData = selectedData.find(
                (item) =>
                  item.day === formattedDate ||
                  item.day ===
                    targetDate.toLocaleDateString("en-US", { weekday: "long" })
              );

              return dayData ? dayData.trips : 0;
            });

            newLineDataPoints = daysOfWeek.map((day, index) => {
              const targetDate = new Date(weekStartDate);
              targetDate.setDate(weekStartDate.getDate() + index);

              const formattedDate = `${String(targetDate.getDate()).padStart(
                2,
                "0"
              )}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`;

              const dayData = selectedData.find(
                (item) =>
                  item.day === formattedDate ||
                  item.day ===
                    targetDate.toLocaleDateString("en-US", { weekday: "long" })
              );

              return dayData ? dayData.earnings : 0;
            });
            break;

          case "month":
            const month = new Date().getMonth() + 1;
            const monthLabel = `Tháng ${month}`;

            const totalDaysInMonth = new Date(
              new Date().getFullYear(),
              month,
              0
            ).getDate();

            newLabels = Array.from({ length: totalDaysInMonth }, (_, i) =>
              (i + 1).toString()
            );

            newTripDataPoints = Array(totalDaysInMonth).fill(0);
            newLineDataPoints = Array(totalDaysInMonth).fill(0);

            selectedData.forEach((item) => {
              const day = new Date(item.timestamp).getDate();
              if (item.date === monthLabel) {
                newTripDataPoints[day - 1] += item.trips;
                newLineDataPoints[day - 1] += item.earnings;
              }
            });

            break;

          case "lastMonth":
            newLabels = Array.from(
              {
                length: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  0
                ).getDate(),
              },
              (_, i) => (i + 1).toString()
            );
            newTripDataPoints = newLabels.map((day) => {
              const dayData = selectedData.find((item) => item.day === day);
              return dayData ? dayData.trips : 0;
            });
            newLineDataPoints = newLabels.map((day) => {
              const dayData = selectedData.find((item) => item.day === day);
              return dayData ? dayData.earnings : 0;
            });
            break;

          case "year":
          case "lastYear":
            const monthNames = [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ];

            newLabels = monthNames;
            newTripDataPoints = newLabels.map((month) => {
              const monthData = selectedData.find(
                (item) => item.month === month
              );
              return monthData ? monthData.trips : 0;
            });
            newLineDataPoints = newLabels.map((month) => {
              const monthData = selectedData.find(
                (item) => item.month === month
              );
              return monthData ? monthData.earnings : 0;
            });
            break;

          default:
            console.warn(`Không có dữ liệu cho phạm vi: ${range}`);
        }

        setLabels(newLabels);
        setTripDataPoints(newTripDataPoints);
        setLineDataPoints(newLineDataPoints);
      } else {
        console.warn(`Không có dữ liệu cho phạm vi: ${range}`);
        setLabels([]);
        setTripDataPoints([]);
        setLineDataPoints([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  useEffect(() => {
    fetchStatistics(timeRange);
  }, [timeRange, driverId]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const barData = {
    labels: labels.length > 0 ? labels : ["Không có dữ liệu"],
    datasets: [
      {
        label: "Số chuyến đi",
        data: tripDataPoints.length > 0 ? tripDataPoints : [0],
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const lineData = {
    labels: labels.length > 0 ? labels : ["Không có dữ liệu"],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: lineDataPoints.length > 0 ? lineDataPoints : [0],
        borderColor: "#ff6384",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const totalTrip = tripDataPoints.reduce((sum, value) => sum + value, 0);

  return (
    <div className="statistical-container">
      <h2>Thống Kê Tài Xế</h2>
      <div className="time-range-buttons">
        <button
          onClick={() => handleTimeRangeChange("Hôm qua")}
          style={{
            backgroundColor: setTimeRange === "Hôm qua" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Hôm qua" ? "#fff" : "#000",
          }}
        >
          Hôm qua
        </button>
        <button
          onClick={() => handleTimeRangeChange("Hôm nay")}
          style={{
            backgroundColor: setTimeRange === "Hôm nay" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Hôm nay" ? "#fff" : "#000",
          }}
        >
          Hôm nay
        </button>
        <button
          onClick={() => handleTimeRangeChange("Tuần này")}
          style={{
            backgroundColor:
              setTimeRange === "Tuần này" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Tuần này" ? "#fff" : "#000",
          }}
        >
          Tuần này
        </button>
        <button
          onClick={() => handleTimeRangeChange("Tháng này")}
          style={{
            backgroundColor:
              setTimeRange === "Tháng này" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Tháng này" ? "#fff" : "#000",
          }}
        >
          Tháng này
        </button>
        <button
          onClick={() => handleTimeRangeChange("Tháng trước")}
          style={{
            backgroundColor:
              setTimeRange === "Tháng trước" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Tháng trước" ? "#fff" : "#000",
          }}
        >
          Tháng trước
        </button>
        <button
          onClick={() => handleTimeRangeChange("Năm này")}
          style={{
            backgroundColor: setTimeRange === "Năm này" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Năm này" ? "#fff" : "#000",
          }}
        >
          Năm này
        </button>
        <button
          onClick={() => handleTimeRangeChange("Năm trước")}
          style={{
            backgroundColor:
              setTimeRange === "Năm trước" ? "#007bff" : "#f0f0f0",
            color: setTimeRange === "Năm trước" ? "#fff" : "#000",
          }}
        >
          Năm trước
        </button>
      </div>
      <div className="chart-container">
        <h4 style={{ marginTop: "15px" }}>Số chuyến đi: {totalTrip}</h4>
        <Bar key={timeRange} data={barData} options={{ responsive: true }} />
      </div>
      <div className="chart-container" style={{ marginTop: "30px" }}>
        <h4>Doanh thu (VND)</h4>
        <Line key={timeRange} data={lineData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Statistical;

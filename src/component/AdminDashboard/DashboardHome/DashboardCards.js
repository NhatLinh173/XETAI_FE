import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosInstance from "../../../config/axiosConfig";
const AdminDashboardCards = () => {
  const [adminStatisticsData, setAdminStatisticsData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [adminVisitorChartData, setAdminVisitorChartData] = useState(0);
  const [adminCustomerAnalyticsData, setAdminCustomerAnalyticsData] = useState(
    []
  );

  useEffect(() => {
    const fetchDataStatic = async () => {
      try {
        const response = await axiosInstance.get("/admin/static/stats");
        if (response.data && Array.isArray(response.data.visitsByDay)) {
          const chartData = response.data.visitsByDay.map((item) => ({
            date: item._id,
            visitors: item.count,
          }));
          setAdminVisitorChartData(chartData);
        } else {
          console.error("Dữ liệu không hợp lệ:", response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataStatic();
  }, []);

  useEffect(() => {
    const fetchDataStatic = async () => {
      try {
        const response = await axiosInstance.get("/admin/static/summary");
        if (response.data && Array.isArray(response.data.breakdown)) {
          setAdminStatisticsData(response.data.breakdown);
          setTotalAmount(response.data.totalAmount);
          setMonthlyAmount(response.data.monthlyAmount);
          setMonthlyBreakdown(response.data.monthlyBreakdown);
          setTotalOrders(response.data.totalOrders);
        } else {
          console.error("Dữ liệu không hợp lệ:", response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataStatic();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/static/customer-analysis"
        );
        const data = [
          {
            name: "Khách hàng mới",
            value: response.data.newCustomers,
            color: "#0d6efd",
          },
          {
            name: "Khách hàng quay lại",
            value: response.data.returningCustomers,
            color: "#28a745",
          },
        ];

        setAdminCustomerAnalyticsData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container fluid className="admin-dashboard-container p-4">
      {/* Thẻ thống kê */}
      <Row className="admin-statistics-row mb-4">
        <Col xs={12} md={6} lg={6} className="mb-4">
          <Card
            className="admin-stat-card custom-background"
            style={{ backgroundColor: "#00CCFF", color: "#ffffff" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                  <h6 className="admin-stat-title mb-2">Tổng Đơn Hàng</h6>
                  <h3 className="admin-stat-value mb-1">{totalOrders}</h3>
                </div>
              </div>
              <div className="mt-3">
                <div className="admin-stat-subtitle">
                  <strong>Tổng Trong Tháng Này:</strong> {totalOrders}{" "}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={6} className="mb-4">
          <Card
            className="admin-stat-card custom-background"
            style={{ backgroundColor: "#FF9900", color: "#ffffff" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                  <h6 className="admin-stat-title mb-2">Tổng Doanh Thu</h6>
                  <h3 className="admin-stat-value mb-1">{totalAmount}</h3>
                </div>
              </div>
              <div className="mt-3">
                <div className="admin-stat-subtitle">
                  <strong>Tổng Trong Tháng Này:</strong> {monthlyAmount}{" "}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ thống kê */}
      <Row className="admin-charts-row">
        {/* Biểu đồ lượt truy cập */}
        <Col xs={12} lg={6} className="mb-4">
          <Card className="admin-chart-card">
            <Card.Body>
              <h5 className="admin-chart-title mb-4">Thống Kê Lượt Truy Cập</h5>
              <div className="admin-chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={adminVisitorChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="date" // Sử dụng ngày làm trục x
                      stroke="#666"
                      fontSize={12}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors" // Hiển thị số lượt truy cập
                      name="Lượt truy cập"
                      stroke="#0d6efd"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Biểu đồ phân tích khách hàng */}
        <Col xs={12} lg={6} className="mb-4">
          <Card className="admin-chart-card">
            <Card.Body>
              <h5 className="admin-chart-title mb-4">Phân Tích Khách Hàng</h5>

              <div className="admin-chart-container mb-4">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={adminCustomerAnalyticsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {adminCustomerAnalyticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardCards;

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axiosInstance from "../../../config/axiosConfig";

const TransactionSystem = () => {
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axiosInstance.get("/payment/all/transaction");
        setTransaction(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giao dịch:", error);
      }
    };

    fetchTransaction();
  }, []);

  const offset = currentPage * transactionsPerPage;
  const currentTransactions = transaction.slice(
    offset,
    offset + transactionsPerPage
  );

  const pageCount = Math.ceil(transaction.length / transactionsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <div className=" transaction-container mt-5 ">
        <h2 className="text-center transaction-title">
          Giao dịch của hệ thống
        </h2>
        <table className="table table-hover mt-4">
          <thead className="transaction-header">
            <tr>
              <th>STT</th>
              <th>Số điện thoại</th>
              <th>Ngày</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((item, index) => (
                <tr key={index}>
                  <td>{offset + index + 1}</td>
                  <td>{item.userId?.phone || "Không xác định"}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    {item.type === "POST_PAYMENT"
                      ? "Trừ phí đăng bài"
                      : item.type === "CANCEL_ORDER"
                      ? "Trừ phí hủy đơn hàng"
                      : item.type === "BANK_TRANSFER_PAYMENT"
                      ? "Thanh toán qua chuyển khoản"
                      : item.type === "PAYING_FOR_ORDER"
                      ? "Thanh toán tiền hàng cho tài xế"
                      : item.type === "RECEIVING_PAYMENT_FROM_ORDER"
                      ? "Nhận tiền hàng từ khách hàng"
                      : item.type === "WITHDRAW"
                      ? "Rút tiền"
                      : "Nạp Tiền"}
                  </td>
                  <td>{item.amount.toLocaleString()} ₫</td>
                  <td>
                    <span
                      className={`status ${
                        item.status === "PAID" || item.status === "COMPLETED"
                          ? "status-success"
                          : "status-failed"
                      }`}
                    >
                      {item.status === "PAID" || item.status === "COMPLETED"
                        ? "Thành Công"
                        : item.status === "PENDING"
                        ? "Đang Chờ"
                        : "Thất Bại"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="customer-management-pagination-controls text-center">
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          breakLabel={"..."}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default TransactionSystem;

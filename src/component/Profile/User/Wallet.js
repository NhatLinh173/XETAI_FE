import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../assets/css/wallet.css";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../config/axiosConfig";
import ReactPaginate from "react-paginate";
import axios from "axios";

const Wallet = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [banks, setBanks] = useState([]);
  const [bankNameInput, setBankNameInput] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(data.balance || 0);
  const [transactions, setTransactions] = useState([]);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { fullName } = data || {};
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 4;
  const offset = currentPage * transactionsPerPage;
  const currentTransactions = Array.isArray(transactions)
    ? transactions.slice(offset, offset + transactionsPerPage)
    : [];

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const handleDepositClick = () => {
    setShowModal(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDepositAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const formattedValue = formatNumberWithCommas(rawValue);
    setDepositAmount(formattedValue);
  };

  const handleWithdrawAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const formattedValue = formatNumberWithCommas(rawValue);
    setWithdrawAmount(formattedValue);
  };

  const handleDepositSubmit = async () => {
    const amount = parseInt(depositAmount.replace(/,/g, ""), 10);
    if (amount < 5000 || amount > 1000000) {
      setError("Số tiền phải nằm trong khoảng 5,000 VND và 1,000,000 VND");
      return;
    }

    setError("");
    try {
      const response = await axiosInstance.post("/payment/create", {
        description: "Payment for order",
        returnUrl: "http://localhost:3006/payment/success",
        cancelUrl: "http://localhost:3006/payment/failed",
        totalPrice: amount,
        orderCodeStatus: "Pending",
        userId: userId,
      });

      if (response.status === 200) {
        setCheckoutUrl(response.data.data.checkoutUrl);
        window.location.href = response.data.data.checkoutUrl;
      }
    } catch (error) {
      console.error("API call failed: ", error);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(
            `/auth/transaction/${userId}`
          );

          if (response.status === 200) {
            setTransactions(response.data.transactions);
            console.log(response.data.transactions);
          }
        } catch (error) {
          console.error("Lỗi khi lấy giao dịch:", error);
        }
      }
    };

    fetchTransaction();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);

        try {
          const userResponse = await axiosInstance.get(
            `/auth/user/${decodedToken.id}`
          );
          if (userResponse.status === 200) {
            setBalance(userResponse.data.balance);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [location]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("https://api.vietqr.io/v2/banks");
        setBanks(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ngân hàng:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (bankNameInput) {
      setFilteredBanks(
        banks.filter((bank) =>
          bank.shortName.toLowerCase().includes(bankNameInput.toLowerCase())
        )
      );
    } else {
      setFilteredBanks([]);
    }
  }, [bankNameInput, banks]);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (accountNumber && selectedBank) {
        try {
          const response = await axios.post(
            "https://api.httzip.com/api/bank/id-lookup-prod",
            {
              bank: selectedBank,
              account: accountNumber,
            },
            {
              headers: {
                "x-api-key": "43bcf4c8-fdc7-4c58-9451-90b30181eebdkey",
                "x-api-secret": "fe0abc8f-eff5-487c-8c58-19810908674dsecret",
              },
            }
          );

          if (response.status === 200) {
            setAccountHolderName(response.data.data.ownerName);
          } else {
            console.error("Failed to fetch account info");
          }
        } catch (error) {
          console.error("Error fetching account info:", error);
        }
      }
    };

    fetchAccountInfo();
  }, [accountNumber, selectedBank]);

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount.replace(/,/g, ""), 10);
    if (amount < 50000 || amount > 5000000) {
      setError("Số tiền phải nằm trong khoảng 5,000 VND và 5,000,000 VND");
      return;
    }

    try {
      const response = await axiosInstance.post("/payment/withdraw", {
        amount: amount,
        bankName: bankNameInput,
        accountNumber: accountNumber,
        userId: userId,
        accountHolderName: accountHolderName,
      });
      if (response.status === 200) {
        setNotificationMessage(
          "Vui lòng chờ hệ thống từ 10 đến 15 phút để xử lý"
        );
        setShowNotificationModal(true);
        resetWithdrawModal();
      }
    } catch (error) {
      console.error("Lỗi khi rút tiền:", error);
      setNotificationMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setShowNotificationModal(true);
    }
  };

  const handleBankSelect = (bankCode, bankShortName) => {
    setSelectedBank(bankCode);
    setBankNameInput(bankShortName);
    setFilteredBanks([]);
  };

  const resetDepositModal = () => {
    setDepositAmount("");
    setError("");
    setShowModal(false);
  };

  const resetWithdrawModal = () => {
    setWithdrawAmount("");
    setBankNameInput("");
    setAccountNumber("");
    setSelectedBank("");
    setFilteredBanks([]);
    setAccountHolderName("");
    setShowWithdrawModal(false);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setNotificationMessage("");
  };

  return (
    <div>
      <h2>Ví của Bạn</h2>
      <div className="d-flex justify-content-between mt-2">
        <div className="d-flex flex-column">
          <h4>Tài khoản: {fullName || "Chưa có thông tin"}</h4>
          <span>Số dư: {(balance || 0).toLocaleString()} VNĐ</span>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button className="btn btn-primary" onClick={handleDepositClick}>
            Nạp tiền
          </button>
          <button className="btn btn-primary" onClick={handleWithdrawClick}>
            Rút tiền
          </button>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2">
          <h4>Lịch sử giao dịch</h4>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại giao dịch</th>
              <th>Trạng thái giao dịch</th>
              <th>Số tiền</th>
              <th>Ngày tháng</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{offset + index + 1}</td>
                  <td>
                    {transaction.type === "POST_PAYMENT"
                      ? "Trừ phí đăng bài"
                      : transaction.type === "CANCEL_ORDER"
                      ? "Trừ phí hủy đơn hàng"
                      : transaction.type === "BANK_TRANSFER_PAYMENT"
                      ? "Thanh toán qua chuyển khoản"
                      : transaction.type === "PAYING_FOR_ORDER"
                      ? "Thanh toán tiền hàng cho tài xế"
                      : transaction.type === "RECEIVING_PAYMENT_FROM_ORDER"
                      ? "Nhận tiền hàng từ khách hàng"
                      : transaction.type === "WITHDRAW"
                      ? "Rút tiền"
                      : transaction.type === "RECEIVE_CANCELLATION_FEE"
                      ? "Trả phí hủy đơn hàng"
                      : "Nạp Tiền"}
                  </td>
                  <td>
                    {transaction.status === "PAID" ||
                    transaction.status === "COMPLETED"
                      ? "Thành Công"
                      : transaction.status === "PENDING"
                      ? "Đang Chờ"
                      : "Thất Bại"}
                  </td>
                  <td
                    style={{
                      color:
                        transaction.type === "POST_PAYMENT" ||
                        transaction.type === "CANCEL_ORDER" ||
                        transaction.type === "PAYING_FOR_ORDER" ||
                        transaction.type === "WITHDRAW"
                          ? "red"
                          : transaction.type === "DEPOSIT"
                          ? "#00FF00"
                          : transaction.type ===
                              "RECEIVING_PAYMENT_FROM_ORDER" ||
                            transaction.type === "RECEIVE_CANCELLATION_FEE"
                          ? "#00FF00"
                          : "inherit",
                    }}
                  >
                    {transaction.type === "POST_PAYMENT" ||
                    transaction.type === "CANCEL_ORDER" ||
                    transaction.type === "PAYING_FOR_ORDER" ||
                    transaction.type === "WITHDRAW"
                      ? `-${(transaction.amount || 0).toLocaleString()} đ`
                      : transaction.status === "PAID" ||
                        transaction.status === "RECEIVE_CANCELLATION_FEE"
                      ? `+${(transaction.amount || 0).toLocaleString()} đ`
                      : `${(transaction.amount || 0).toLocaleString()} đ`}
                  </td>
                  <td>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div
          className="modal show bg-dark bg-opacity-75"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nạp tiền</h5>
                <button
                  type="button"
                  className="close"
                  onClick={resetDepositModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="depositAmount">Nhập số tiền muốn nạp:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={handleDepositAmountChange}
                    placeholder="Số tiền (VND)"
                  />
                  {error && <div className="text-danger mt-2">{error}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetDepositModal}
                >
                  Đóng
                </button>
                {!checkoutUrl && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDepositSubmit}
                  >
                    Xác nhận nạp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rút tiền</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetWithdrawModal}
                ></button>
              </div>
              <div className="modal-body d-flex flex-column">
                <div className="mb-3">
                  <label className="form-label">Nhập số tiền:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={withdrawAmount}
                    onChange={handleWithdrawAmountChange}
                    placeholder="Số tiền (VND)"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tìm kiếm ngân hàng:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bankNameInput}
                    onChange={(e) => setBankNameInput(e.target.value)}
                    placeholder="Nhập tên ngân hàng"
                  />
                  {filteredBanks.length > 0 && (
                    <ul
                      className="list-group position-absolute w-100"
                      style={{ zIndex: 1 }}
                    >
                      {filteredBanks.map((bank) => (
                        <li
                          key={bank.code}
                          className="list-group-item list-group-item-action bank-item"
                          onClick={() => handleBankSelect(bank.code, bank.name)}
                        >
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="bank-logo"
                          />
                          <span className="bank-name">{bank.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Nhập số tài khoản:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="Số tài khoản"
                    required
                  />
                </div>
                {accountHolderName && (
                  <div className="mb-3">
                    <label className="form-label">Tên chủ tài khoản:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={accountHolderName}
                      readOnly
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={resetWithdrawModal}
                >
                  Đóng
                </button>
                <button className="btn btn-primary" onClick={handleWithdraw}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotificationModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thông báo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeNotificationModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{notificationMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={closeNotificationModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReactPaginate
        pageCount={Math.ceil(transactions.length / transactionsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
        previousLabel={"<<"}
        nextLabel={">>"}
      />
    </div>
  );
};

export default Wallet;

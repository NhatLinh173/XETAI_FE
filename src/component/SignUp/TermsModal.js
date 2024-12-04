import React from "react";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";

const TermsModal = ({ isOpen, onRequestClose }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Terms and Conditions"
      className="terms-modal"
      overlayClassName="terms-overlay"
    >
      <h2 className="terms-title">Điều Khoản & Điều Kiện</h2>
      <div className="terms-content">
        {type === "personal" ? (
          <>
            <p className="terms-subtitle">
              Điều khoản và điều kiện dành cho tài xế:
            </p>
            <ul className="terms-list">
              <li>Người dùng đăng bài sẽ chịu phí đăng bài.</li>
              <li>Tài xế sẽ bị trừ 5% phí trên mỗi đơn hàng hoàn thành.</li>
              <li>
                Hành vi spam sẽ bị xử lý nghiêm, có thể dẫn đến việc cấm tài
                khoản tùy theo mức độ vi phạm.
              </li>
              <li>
                Nếu tài xế đã nhận đơn nhưng tự ý hủy sẽ phải bồi thường 80% giá
                trị vận chuyển của chuyến hàng đó.
              </li>
            </ul>
          </>
        ) : (
          <>
            <p className="terms-subtitle">
              Điều khoản và điều kiện dành cho người dùng:
            </p>
            <ul className="terms-list">
              <li>Người dùng đăng bài sẽ chịu phí đăng bài.</li>
              <li>
                Hành vi spam sẽ bị xử lý nghiêm, có thể dẫn đến việc cấm tài
                khoản tùy theo mức độ vi phạm.
              </li>
              <li>
                Nếu người dùng tự ý hủy đơn sau khi tài xế đã nhận sẽ phải bồi
                thường 80% giá trị vận chuyển của chuyến hàng đó.
              </li>
            </ul>
          </>
        )}
      </div>
      <button onClick={onRequestClose} className="terms-close-btn">
        Đóng
      </button>
    </Modal>
  );
};

export default TermsModal;

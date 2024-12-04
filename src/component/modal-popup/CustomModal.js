import React from "react";
import Modal from "react-modal";
import "../../assets/css/modalPopup.css";
import { IoMdClose, IoMdPeople } from "react-icons/io";
import { MdDriveEta } from "react-icons/md";
Modal.setAppElement("#root");

const CustomModal = ({ isOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="User selection Modal"
      overlayClassName="modal-overlay custom-modal-overlay "
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(5px)",
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          background: "white",
          padding: "20px",
          borderRadius: "4px",
          maxWidth: "500px",
          width: "90%",
          margin: "auto",
        },
      }}
    >
      <div className="modal-header custom-modal-header">
        <button onClick={closeModal} className="close-btn custom-close-btn">
          <IoMdClose />
        </button>
      </div>
      <div className="modal-body custom-modal-body">
        <a href="/signup?type=personal">
          <div className="option custom-option">
            <MdDriveEta className="icon custom-icon" />
            <span className="text custom-text">Đối tác tài xế</span>
          </div>
        </a>
        <a href="/signUp-customer">
          <div className="option custom-option">
            <IoMdPeople className="icon custom-icon" />
            <span className="text custom-text">Khách hàng</span>
          </div>
        </a>
      </div>
    </Modal>
  );
};

export default CustomModal;

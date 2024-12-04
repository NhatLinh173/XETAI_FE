import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import avatarDefault from "../../assets/img/icon/avatarDefault.jpg";
import { Button } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";

const PostItem = ({
  PostDriver,
  handleThreeDotsClick,
  showReportButtons,
  handleReportClick,
  handleContactClick,
}) => {
  if (!PostDriver) {
    return null;
  }
  const {
    _id,
    images,
    startCity,
    destinationCity,
    description,
    creatorId,
    createdAt,
  } = PostDriver;
  const userId = creatorId?.userId?._id;
  const avatar = creatorId?.userId?.avatar || avatarDefault;
  const fullName = creatorId?.userId?.fullName;

  return (
    <div>
      <div
        key={_id}
        style={{
          position: "relative",
          margin: "13px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f8f9fa",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "350px",
          height: "550px",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div
          className="position-absolute"
          style={{
            top: "10px",
            right: "10px",
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => handleThreeDotsClick(_id)}
          title="Báo cáo bài đăng"
        >
          <span
            style={{
              color: "#333",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            •••
          </span>
        </div>

        {showReportButtons[_id] && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "10px",
              zIndex: 10,
              backgroundColor: "#fff",
              padding: "5px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              className="btn btn-danger btn-sm"
              onClick={handleReportClick}
              style={{ width: "100%" }}
            >
              Báo cáo
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            flexShrink: 0,
          }}
        >
          <Link to={`/driver/${userId}`}>
            <img
              src={avatar}
              alt="Avatar"
              style={{
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                marginRight: "15px",
                border: "2px solid #007bff",
              }}
            />
          </Link>
          <div>
            <Link to={`/driver/${userId}`}>
              <h4 style={{ margin: 0, color: "#007bff", fontSize: "18px" }}>
                {fullName}
              </h4>
            </Link>
            <p style={{ fontSize: "0.9em", color: "#888" }}>
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <p>
          <strong>Điạ điểm lấy hàng:</strong> {startCity}
        </p>
        <p>
          <strong>Địa điểm trả hàng:</strong> {destinationCity}
        </p>
        <p
          style={{
            marginBottom: "10px",
            color: "#555",
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 3,
            lineHeight: "1.5",
          }}
        >
          {description}
        </p>
        <img
          src={images}
          alt="Post"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            className="btn-theme border-0"
            onClick={() => handleContactClick(creatorId.userId)}
          >
            Liên hệ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;

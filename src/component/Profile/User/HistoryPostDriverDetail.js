import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import axiosInstance from "../../../config/axiosConfig";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PLACEHOLDER_IMAGE =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

const defaultPost = {
  startCity: "",
  destinationCity: "",
  description: "",
  images: [],
};

const HistoryPostDriverDetail = () => {
  const { postId } = useParams(); // Lấy postId từ URL
  const [post, setPost] = useState(defaultPost);
  const [provinces, setProvinces] = useState([]);
  const [tempImages, setTempImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const history = useHistory();

  const uploadTempImages = (event) => {
    const files = event.target.files;
    setTempImages((prevImages) => [...prevImages, ...files]);
  };

  const getPost = React.useCallback(async () => {
    const response = await axiosInstance.get(`/driverpost/${postId}`);
    setPost(response.data);
  }, [postId]);

  const createImageUrl = (imageFile) => {
    return URL.createObjectURL(imageFile);
  };

  const getImageUrl = (data) => {
    if (typeof data === "string" && data.length > 0) {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      return createImageUrl(data);
    }

    return PLACEHOLDER_IMAGE;
  };

  const getProvinces = React.useCallback(async () => {
    try {
      const result = await axios.get(
        "https://provinces.open-api.vn/api/?depth=1"
      );
      const transformedData = result.data.map((item) => ({
        value: item.code,
        label: item.name,
      }));
      setProvinces(transformedData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (postId) {
      getPost();
    }
    getProvinces();
  }, [getPost, getProvinces, postId]);

  // Hàm xử lý thay đổi các trường
  const handleChange = (e, field) => {
    setPost((prevPost) => ({
      ...prevPost,
      [field]: e.target.value,
    }));
  };

  // Hàm xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    setPost((prevPost) => ({
      ...prevPost,
      images: prevPost.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveTempImage = (index) => {
    setTempImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Hàm lưu dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("startCity", post.startCity);
      formData.append("destinationCity", post.destinationCity);
      formData.append("description", post.description);
      formData.append("creatorId", userId);
      post.images.forEach((image) => {
        formData.append("images", image);
      });

      tempImages.forEach((image) => {
        formData.append("images", image);
      });

      setIsLoading(true);

      if (postId) {
        await axiosInstance.put(`/driverpost/${postId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Cập nhật thành công.");
        setTempImages([]);
        getPost();
        return;
      }

      const response = await axiosInstance.post("/driverpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Gửi yêu cầu thêm xe thành công.");
      setTempImages([]);
      history.push(`/history-post-driver/detail/${response.data._id}`);
    } catch (error) {
      // Hiển thị thông báo lỗi cụ thể nếu có
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra";
      toast.error(errorMessage);
      console.error("Error submitting post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Chỉnh sửa bài đăng</h2>
      <div className="row">
        <div className="col-12">
          {/* Hiển thị ảnh bài đăng */}
          <div>
            {/* Hiển thị ảnh đã tải lên */}

            {post.images.length || tempImages.length > 0 ? (
              <div
                className={`d-flex image-form align-items-center mb-3 ${
                  post.images
                    ? "justify-content-center"
                    : "justify-content-between w-100"
                }`}
              >
                <div className="position-relative border rounded-12 p-3 d-flex gap-4 flex-wrap">
                  {post.images.map((image, index) => (
                    <div className="position-relative">
                      <img
                        src={image} // Sử dụng ảnh tải lên nếu có, nếu không thì sử dụng ảnh mặc định
                        alt="Post"
                        className="img-fluid rounded-12"
                        style={{
                          width: "340px",
                          height: "340px",
                          objectFit: "cover",
                        }}
                      />
                      <IoCloseCircleOutline
                        className="position-absolute delete-img"
                        onClick={() => handleRemoveImage(index)} // Xóa ảnh
                      />
                    </div>
                  ))}

                  {tempImages.length > 0 &&
                    tempImages.map((image, index) => (
                      <div className="position-relative">
                        <img
                          key={image.name}
                          src={getImageUrl(image)}
                          alt="Post"
                          style={{
                            width: "340px",
                            height: "340px",
                            objectFit: "cover",
                          }}
                          className="img-fluid rounded-12"
                        />
                        <IoCloseCircleOutline
                          className="position-absolute delete-img"
                          onClick={() => handleRemoveTempImage(index)} // Xóa ảnh
                        />
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {/* Phần tải ảnh lên */}
            <div className="d-flex justify-content-center">
              <input
                className="input-custom"
                id="file-upload"
                type="file"
                multiple
                onChange={uploadTempImages}
                accept="image/*"
              />
              <label
                className="btn btn-danger btn-custom mx-1 d-flex align-items-center"
                style={{ width: "fit-content" }}
                htmlFor="file-upload"
              >
                Tải ảnh lên
              </label>
            </div>
          </div>
        </div>

        {/* Form chỉnh sửa thông tin bài đăng */}
        <div className="col-12">
          <form onSubmit={handleSubmit} className="form">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: "bold" }}>
                  Điểm đi
                </label>
                <select
                  name="startPointCity"
                  value={post.startCity}
                  onChange={(e) => handleChange(e, "startCity")}
                  className="form-control"
                  required
                >
                  <option value="">Chọn điểm đi</option>

                  {provinces.map((province) => (
                    <option key={province.label} value={province.label}>
                      {province.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: "bold" }}>
                  Điểm đến
                </label>
                <select
                  name="destinationCity"
                  value={post.destinationCity}
                  onChange={(e) => handleChange(e, "destinationCity")}
                  className="form-control"
                  required
                >
                  <option value="">Chọn điểm đến</option>

                  {provinces.map((province) => (
                    <option key={province.label} value={province.label}>
                      {province.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Nội dung
              </label>
              <textarea
                name="content"
                value={post.description}
                onChange={(e) => handleChange(e, "description")}
                className="form-control"
                rows="4"
                placeholder="Mô tả nội dung bài đăng"
              ></textarea>
            </div>

            <div className="d-flex justify-content-center mt-3 mb-2">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {isLoading ? "Đang tải..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default HistoryPostDriverDetail;

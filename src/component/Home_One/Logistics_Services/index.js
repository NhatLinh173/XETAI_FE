import React, { useEffect, useState } from "react";
import ServiceCard from "../../Common/Service/ServiceCard";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import useInstanceData from "../../../config/useInstanceData";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import PostItem from "../../postDriver/PostItem";
import Post from "../../postDriver/Post";
import PostDriver from "../../postDriver/PostDriver";
import { Button, Modal } from "react-bootstrap";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
const LogisticsService = () => {
  const history = useHistory();
  const [isDriverExist, setIsDriverExist] = useState(false);
  const [showReportButtons, setShowReportButtons] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const userId = localStorage.getItem("userId");

  const { data: post, loading } = useInstanceData(`/posts`);
  const { data: PostDriver } = useInstanceData(`/driverpost`);
  const driverId = localStorage.getItem("driverId");
  useEffect(() => {
    if (driverId !== "undefined" && driverId) {
      setIsDriverExist(true);
    } else {
      setIsDriverExist(false);
    }
  }, [driverId]);

  const handleThreeDotsClick = (postId) => {
    setSelectedPostId(postId);
    setShowReportButtons((prevState) => {
      const newState = {};

      Object.keys(prevState).forEach((id) => {
        newState[id] = false;
      });

      newState[postId] = !prevState[postId];

      return newState;
    });

    setSelectedPostId(postId);
  };
  useEffect(() => {
    if (selectedPostId) {
      setShowReportButtons((prevState) => {
        const newState = {};

        Object.keys(prevState).forEach((id) => {
          newState[id] = false;
        });

        newState[selectedPostId] = true;

        return newState;
      });
    }
  }, [selectedPostId]);
  const handleReportClick = () => setShowReportModal(true);
  const handleCloseModal = () => {
    setShowReportModal(false);
    setShowReportButtons((prevState) => ({
      ...prevState,
      [selectedPostId]: false,
    }));
  };

  const handleConfirmReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/report", {
        reporterId: userId,
        postId: selectedPostId,
        description: reportReason,
      });
      if (response.status === 201) {
        toast.success("Báo cáo bài đăng thành công!!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!!!!");
    }
    setShowReportModal(false);
    setShowReportButtons((prevState) => ({
      ...prevState,
      [selectedPostId]: false,
    }));
  };

  const handleContactClick = (driverId) => {
    setSelectedDriver(driverId);
    setShowContactModal(true);
  };
  const handleCloseContactModal = () => setShowContactModal(false);

  const handleConfirmContact = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      history.push("/signIn");
    } else if (selectedDriver && selectedDriver._id) {
      history.push(`/chat/${selectedDriver._id}`);
    } else {
      toast.error("Không thể xác định tài xế.");
    }

    setShowContactModal(false);
  };

  return (
    <section id="logistics_area">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="logistics_wrappers">
              <div className="logistic_tabs_button">
                <ul>
                  {isDriverExist && (
                    <li>
                      <h2 className="mb-5">Đơn hàng</h2>
                    </li>
                  )}
                  {!isDriverExist && (
                    <li>
                      <h2 className="mb-5">Xe tìm hàng</h2>
                    </li>
                  )}
                  {!isDriverExist && (
                    <>
                      <OwlCarousel
                        className="owl-theme text-left"
                        autoplayHoverPause={true}
                        margin={20}
                        nav={false}
                        dots={true}
                      >
                        {PostDriver.map((PostDriver) => (
                          <PostItem
                            key={PostDriver._id}
                            PostDriver={PostDriver}
                            handleThreeDotsClick={handleThreeDotsClick}
                            showReportButtons={showReportButtons}
                            handleReportClick={handleReportClick}
                            handleContactClick={handleContactClick}
                          />
                        ))}
                      </OwlCarousel>
                    </>
                  )}
                </ul>
              </div>
              <Modal
                show={showReportModal}
                onHide={handleCloseModal}
                animation={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Báo cáo bài đăng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <textarea
                    className="form-control"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Mô tả lý do báo cáo"
                    rows="4"
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                  </Button>
                  <Button variant="danger" onClick={handleConfirmReport}>
                    Báo cáo
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showContactModal}
                onHide={handleCloseContactModal}
                animation={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Liên hệ với tài xế</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Bạn có chắc chắn muốn liên hệ với tài xế{" "}
                    <strong>{selectedDriver?.fullName}</strong>?
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseContactModal}>
                    Đóng
                  </Button>
                  <Button variant="primary" onClick={handleConfirmContact}>
                    Liên hệ
                  </Button>
                </Modal.Footer>
              </Modal>
              <div className="service_slider_home_two">
                {isDriverExist && (
                  <OwlCarousel
                    className="owl-theme"
                    autoplay={true}
                    autoplayHoverPause={true}
                    autoplayTimeout={2500}
                    margin={20}
                    nav={false}
                    dots={true}
                  >
                    {post &&
                      post?.salePosts?.map((data) => (
                        <ServiceCard
                          key={data._id}
                          id={data._id}
                          img={
                            data.images && data.images.length > 0
                              ? data.images[0]
                              : "default-image.jpg"
                          }
                          goodsType={data.title}
                          pickupLocation={data.startPointCity}
                          dropoffLocation={data.destinationCity}
                          weight={data.load}
                          price={data.price}
                        />
                      ))}
                  </OwlCarousel>
                )}
              </div>
              <div className="review_button">
                {!isDriverExist && (
                  <Link to="/post-driver" className="btn btn-theme mb-2">
                    Xem thêm
                  </Link>
                )}
                {isDriverExist && (
                  <Link to="/order" className="btn btn-theme mb-2">
                    Xem thêm
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogisticsService;

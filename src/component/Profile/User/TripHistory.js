import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import axiosInstance from "../../../config/axiosConfig";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export const TripHistory = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [tripHistories, setTripHistories] = useState([]);

  const userId = localStorage.getItem("userId");
  const driverId = localStorage.getItem("driverId");

  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const currentPageItems = tripHistories.slice(offset, offset + itemPerPage);

  const role = localStorage.getItem("accessToken")
    ? jwtDecode(localStorage.getItem("accessToken")).role
    : "";

  const isDriverRole = useMemo(
    () => role === "personal" || role === "business",
    [role]
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const getFinishTrip = (data) => {
    return data.filter(
      (item) => item.status === "finish" || item.status === "complete"
    );
  };

  const getTripHistory = async () => {
    try {
      if (!userId && !driverId) {
        return;
      }

      const url = isDriverRole
        ? `/posts/${driverId}/driver`
        : `/posts/${userId}/users`;

      const response = await axiosInstance.get(url);

      if (isDriverRole) {
        setTripHistories(getFinishTrip(response.data.data));
      } else {
        setTripHistories(getFinishTrip(response.data.salePosts));
      }
    } catch (error) {
      console.error("Failed to fetch trip history:", error);
    }
  };

  useEffect(() => {
    getTripHistory();
  }, []);

  if (!tripHistories.length)
    return (
      <div className="mt-5 text-center font-weight-bold">
        {isDriverRole ? "Chưa có lịch sử chuyến" : "Chưa có đơn hoàn thành"}
      </div>
    );

  return (
    <div className="delivery-history-list">
      <h2 className="mb-4">
        {isDriverRole ? "Lịch sử chuyến" : "Đơn hoàn thành"}
      </h2>

      {currentPageItems.map((item) => (
        <div key={item._id} className="my-4 border rounded-12 item-card">
          <a
            href={`/trip/detail/${item._id}`}
            rel="noreferrer"
            className="link-wrapper"
          >
            <div className="p-3 d-flex">
              <img
                src={
                  item.images?.length
                    ? item.images[0]
                    : "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
                }
                alt={item.title}
                className="rounded-12 cursor-pointer"
                style={{ width: "360px", height: "195px", objectFit: "cover" }}
              />

              <div className="ml-3">
                <div className="mb-1 fs-18 font-weight-bold  mr-2">
                  Địa điểm đi: {item.startPointCity}
                </div>
                <div className="mb-2 fs-18 font-weight-bold  mr-2">
                  Địa điểm đến: {item.destinationCity}
                </div>

                <div className="mb-2 text-secondary">
                  <span className="font-weight-bold mr-2">Bắt đầu:</span>
                  {dayjs(item.startTime).format("HH:mm - DD/MM/YYYY")}
                </div>

                <div className="mb-2 text-secondary">
                  <span className="font-weight-bold mr-2">Kết thúc:</span>
                  {dayjs(item.endTime).format("HH:mm - DD/MM/YYYY")}
                </div>

                <div className="text-secondary">
                  <span className="font-weight-bold mr-2">
                    {isDriverRole ? "Người tạo đơn:" : "Tài xế:"}
                  </span>
                  {isDriverRole
                    ? item.creator?.fullName
                    : item.dealId?.driverId?.userId?.fullName || "N/A"}
                </div>
                <div className="mt-3 fs-18 font-weight-bold total-amount  mr-2">
                  Tổng tiền: {item.price} VND
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}

      <ReactPaginate
        pageCount={Math.ceil(tripHistories.length / itemPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        previousLabel={"<<"}
        nextLabel={">>"}
      />
    </div>
  );
};

// FavoriteDriver.js
import React, { useState, useEffect } from "react";
import DriverCard from "./DriverCard";
import ReactPaginate from "react-paginate";
import axiosIntance from "../../../config/axiosConfig";

const FavoriteDrivers = () => {
  const userId = localStorage.getItem("userId");
  const [drivers, setDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosIntance.get(`/favorites/${userId}`);
        console.log(response.data);
        if (response.data && response.data.favorite) {
          const driver = response.data.favorite.driverId;
          if (driver) {
            setDrivers(Array.isArray(driver) ? driver : [driver]);
          } else {
            console.error(
              "Driver data is missing in favorite:",
              response.data.favorite
            );
          }
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchData();
  }, [userId]);

  const driversPerPage = 3;
  const offset = currentPage * driversPerPage;
  const currentDrivers = Array.isArray(drivers)
    ? drivers.slice(offset, offset + driversPerPage)
    : [];

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  return (
    <div className="container">
      <h2>Tài xế yêu thích</h2>
      {Array.isArray(drivers) && drivers.length > 0 ? (
        currentDrivers.map((driver) => (
          <DriverCard
            key={driver._id}
            id={driver.id}
            driverImage={driver.userId.avatar}
            driverName={driver.userId.fullName}
            rating={driver.rating}
            tripsCompleted={driver.tripsCompleted}
          />
        ))
      ) : (
        <p>Không có tài xế yêu thích.</p>
      )}
      {drivers.length > driversPerPage && (
        <ReactPaginate
          pageCount={Math.ceil(drivers.length / driversPerPage)}
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
      )}
    </div>
  );
};

export default FavoriteDrivers;

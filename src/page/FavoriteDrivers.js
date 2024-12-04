import React from "react";
import FavoriteDriver from "../component/Profile/User"; // Import component FavoriteDriver

const FavoriteDrivers = () => {
  return (
    <div className="container">
      <h2 className="my-4">Tài xế yêu thích của tôi</h2>
      <FavoriteDriver />
    </div>
  );
};

export default FavoriteDrivers;

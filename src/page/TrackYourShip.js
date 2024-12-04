import React from "react";
import CommonBanner from "../component/Common/Banner";
import TrackShipment from "../component/TrackYourShipment";

const TrackYourShip = () => {
  return (
    <>
      <CommonBanner heading="Theo dõi đơn hàng" page="Theo dõi đơn hàng" />
      <TrackShipment />
    </>
  );
};

export default TrackYourShip;

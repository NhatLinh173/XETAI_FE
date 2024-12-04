import React from "react";
import useInstanceData from "../../config/useInstanceData";
import Post from "./Post";

const PostDriver = () => {
  const { data: PostDriver } = useInstanceData("/driverpost");

  return (
    <div className="wrapper">
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <Post PostDriver={PostDriver} />
      </div>
    </div>
  );
};

export default PostDriver;

import React from "react";
import CommonBanner from "../component/Common/Banner";
import BlogLayout from "../component/BlogGrid/index";

const BlogGrid = () => {
  return (
    <>
      <CommonBanner heading="Tin tức" page="Tin tức" />
      <BlogLayout />
    </>
  );
};

export default BlogGrid;

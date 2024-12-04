import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ img, month, day, date, title }) => {
  return (
    <div className="blog-card zoom-effect">
      <div className="blog-image-wrapper">
        <Link to="/blog_details">
          <img src={img} alt="blog" className="blog-image" />
        </Link>
        <div className="blog-date">
          <small className="blog-month">{month}</small>
          <span className="blog-day">{day}</span>
        </div>
      </div>
      <div className="blog-content">
        <h6 className="blog-time">
          <i className="far fa-clock"></i> {new Date(date).toLocaleDateString()}
        </h6>
        <h5 className="blog-heading">
          <Link to="/blog_details">{title}</Link>
        </h5>
      </div>
    </div>
  );
};

export default BlogCard;

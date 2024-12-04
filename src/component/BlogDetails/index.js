import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";

const BlogDetailsArea = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [blogData, setBlogData] = useState([]);
  const itemsPerPage = 6;

  const pageCount = Math.ceil(blogData.length / itemsPerPage);

  const currentBlogs = blogData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://https://xetai-be.vercel.app/blog"
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5 blog-details-section">
      {/* Main Blog Content Area */}
      <div className="row">
        {/* Main Blog Card */}
        <div className="col-md-7">
          {blogData[0] && (
            <div className="card mb-4 blog-main-card shadow-effect">
              <img
                src={blogData[0].image}
                className="card-img-top"
                alt="Main blog content"
                style={{ height: "412px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title blog-card-title text-truncate">
                  {blogData[0].title}
                </h5>
                <p className="card-text text-truncate">
                  {blogData[0].description}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    to={`/blog/${blogData[0]._id}`}
                    className="text-primary font-weight-bold"
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Content (Related Topics) */}
        <div className="col-md-5">
          <div className="list-group blog-sidebar">
            <h5 className="sidebar-title">Bài Đăng Nổi Bật</h5>
            {blogData.slice(1, 5).map((item, idx) => (
              <Link
                to={`/blog/${item._id}`}
                className="list-group-item list-group-item-action d-flex align-items-center"
                key={idx}
              >
                <div className="col-4 pr-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid blog-sidebar-img rounded"
                  />
                </div>
                <div className="col-8 pl-2">
                  <h6 className="blog-title">{item.title}</h6>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Related Blog Posts Section */}
      <div className="blog-container">
        <div className="row">
          {currentBlogs.map((data) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12 col-12 mb-4"
              key={data._id}
            >
              <div className="blog-card zoom-effect">
                <div className="blog-image-wrapper">
                  <Link to={`/blog/${data._id}`}>
                    <img src={data.image} alt="blog" className="blog-image" />
                  </Link>
                  <div className="blog-date">
                    <small className="blog-month">
                      {new Date(data.createdAt).getMonth() + 1}
                    </small>
                    <span className="blog-day">
                      {new Date(data.createdAt).getDate()}
                    </span>
                  </div>
                </div>
                <div className="blog-content">
                  <h6 className="blog-time">
                    <i className="far fa-clock"></i>{" "}
                    {new Date(data.createdAt).toLocaleDateString()}
                  </h6>
                  <h5 className="blog-heading">
                    <Link to={`/blog/${data._id}`}>{data.title}</Link>
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="pagination-controls-services text-center">
          <ReactPaginate
            pageCount={pageCount}
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
      </div>
    </div>
  );
};

export default BlogDetailsArea;

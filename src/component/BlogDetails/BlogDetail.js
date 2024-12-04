import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blogDetail, setBlogDetail] = useState(null);
  const [blogData, setBlogData] = useState([]);
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(
          `http://https://xetai-be.vercel.app/blog/${id}`
        );
        setBlogDetail(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataBlog = async () => {
      try {
        const response = await axios.get(
          "http://https://xetai-be.vercel.app/blog"
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchDataBlog();
  }, []);

  if (!blogDetail) {
    return <h2>Không tìm thấy bài viết</h2>;
  }

  const paragraphs = blogDetail.description
    ? blogDetail.description.trim().replace(/\n+/g, "\n").split("\n\n")
    : [];

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Phần nội dung blog */}
        <div className="col-md-8">
          <div className="breadcrumb mb-3">
            <a href="/">Trang chủ</a> / <a href="/blog_details">Blog</a> /{" "}
            {blogDetail.title}
          </div>
          <div className="card blog-detail-card shadow-effect mb-4">
            <img
              src={blogDetail.image}
              className="card-img-top"
              alt={blogDetail.title}
              style={{
                height: "400px",
                objectFit: "cover",
                marginBottom: "20px",
              }}
            />
            <div
              className="card-body"
              style={{ padding: "30px", lineHeight: "1.8" }}
            >
              <h5 className="card-title mb-4" style={{ fontWeight: "bold" }}>
                {blogDetail.title}
              </h5>
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    style={{ marginBottom: "15px", textAlign: "justify" }}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>Không có nội dung bài viết.</p>
              )}
            </div>
          </div>
        </div>

        {/* Phần các bài blog liên quan */}
        <div className="col-md-4">
          <div className="card-header related-blogs-header">
            <h3>Tin tức liên quan</h3>
          </div>
          <div className="card related-blogs-card shadow-effect mb-4">
            <div className="card-body">
              {/* Danh sách bài blog liên quan */}
              <ul className="list-group related-blogs-list">
                {blogData.map((relatedPost, index) => (
                  <li
                    key={index}
                    className="list-group-item related-blogs-item d-flex align-items-start"
                  >
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="related-blog-image"
                    />
                    <div>
                      <a href="/" className="related-blog-title">
                        {relatedPost.title}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

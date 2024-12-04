import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogHome = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get("https://xetai-be.vercel.app/blog");

        const processedData = response.data.map((data) => {
          const dateObj = new Date(data.createdAt);
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();

          return {
            ...data,
            year,
            month,
            day,
          };
        });

        setBlogData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="news_blog_area">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="blog_wrappers">
              <h2 className="section-title text-center mb-5">Tin tức</h2>
              <div className="blog_slider">
                <OwlCarousel
                  className="owl-theme"
                  autoplay={true}
                  autoplayHoverPause={true}
                  autoplayTimeout={2500}
                  loop={true}
                  margin={20}
                  nav={false}
                  dots={true}
                >
                  {blogData.slice(0, 6).map((data) => (
                    <BlogCard
                      key={data._id}
                      img={data.image}
                      title={data.title}
                      year={data.year}
                      month={data.month}
                      day={data.day}
                      date={data.createdAt}
                    />
                  ))}
                </OwlCarousel>
              </div>
              <div
                className="view_more_button"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Link to="/blog_details" className="btn btn-theme mb-2">
                  Xem thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHome;

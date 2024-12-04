import React, { useState } from 'react';
import { BlogData } from '../Common/Blog/BlogData';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const BlogLayout = () => {
    const itemsPerPage = 6; // Số bài viết trên mỗi trang
    const [currentPage, setCurrentPage] = useState(0);

    // Tính toán số trang dựa trên số lượng bài viết và số bài viết mỗi trang
    const pageCount = Math.ceil(BlogData.length / itemsPerPage);

    // Lấy danh sách bài viết cho trang hiện tại
    const currentItems = BlogData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Xử lý sự kiện khi trang thay đổi
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <section id="blog_area_page">
                <div className="blog-container">
                    <div className="row">
                        {currentItems.map((data, index) => (
                            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-4" key={index}>
                                <div className="blog-card zoom-effect">
                                    <div className="blog-image-wrapper">
                                        <Link to="/blog_details">
                                            <img src={data.img} alt="blog" className="blog-image" />
                                        </Link>
                                        <div className="blog-date">
                                            <small className="blog-month">{data.month}</small>
                                            <span className="blog-day">{data.day}</span>
                                        </div>
                                    </div>
                                    <div className="blog-content">
                                        <h6 className="blog-time"><i className="far fa-clock"></i> {data.date}</h6>
                                        <h5 className="blog-heading">
                                            <Link to="/blog_details">{data.heading}</Link>
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
            </section>
        </>
    );
}

export default BlogLayout;

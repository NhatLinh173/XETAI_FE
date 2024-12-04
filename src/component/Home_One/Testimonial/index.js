import React from "react";
// Import TestimonialsData
import { TestimonialsData } from "../Testimonial/TestimonialData";
//  OwlCarousel Slider Import
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Testimonials = () => {
  let responsive = {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    960: {
      items: 1,
    },
    1200: {
      items: 2,
    },
  };

  return (
    <>
      <section id="client_review_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="client_sliders_wrappers">
                <OwlCarousel
                  className="owl-theme"
                  margin={30}
                  responsive={responsive}
                  autoplay={true}
                  dots={false}
                  nav={true}
                  autoplayHoverPause={true}
                  autoplayTimeout={2500}
                >
                  {TestimonialsData.map((data, index) => (
                    <div className="client_items" key={index}>
                      <i className="fas fa-quote-right fa-3x"></i>
                      <div className="testimonial-box">
                        <span>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="far fa-star"></i>
                        </span>
                        <p>{data.para}</p>
                        <div className="client-destination">
                          <div className="client-image">
                            <img src={data.img} alt="Image_Client" />
                          </div>
                          <div className="client-details">
                            <h5>{data.name}</h5>
                            <p>{data.dest}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
              <div className="review_button">
                <a href="#!" className="btn btn-theme mb-2">
                  Xem thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;

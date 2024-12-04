import { useState } from "react"

const TripCarousel = ({ images, imgStyle }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }
  return (
    <div>
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-ride="carousel"
      >
        <div className="carousel-inner rounded-12">
          {images &&
            images.map((img, index) => (
              <div
                className={`carousel-item text-center ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <img
                  src={img}
                  className="fix-img"
                  style={imgStyle}
                  alt="service"
                />
              </div>
            ))}
        </div>
        <button
          className="carousel-control-prev border-0 carousel-bg"
          type="button"
          data-target="#carouselExampleControls"
          data-slide="prev"
          onClick={prevSlide}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span class="sr-only">Previous</span>
        </button>
        <button
          className="carousel-control-next border-0  carousel-bg"
          type="button"
          data-target="#carouselExampleControls"
          data-slide="next"
          onClick={nextSlide}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  )
}

export default TripCarousel

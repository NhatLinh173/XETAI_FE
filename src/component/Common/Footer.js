import React from "react"
import { Link } from "react-router-dom"
// Import Logo Import
import logo from "../../assets/img/RFTMS_logo_13.png"

const FooterItems = [
  {
    title: "Liên kết",

    links: [
      { linkTitle: "Trang chủ", link: "/" },
      { linkTitle: "Chúng tôi", link: "/about" },
      { linkTitle: "Đơn Hàng", link: "/service" },
      { linkTitle: "Tin tức", link: "/blog_grid" },
      { linkTitle: "Liên hệ", link: "/contact" },
    ],
  },
  {
    title: "Công Ty",

    links: [
      { linkTitle: "Đơn hàng", link: "/service" },
      { linkTitle: "Chứng thực", link: "/testimonials" },
      { linkTitle: "Theo dõi lô hàng", link: "/track_ship" },
      { linkTitle: "Chính sách bảo mật", link: "/privacyPolicy" },
      { linkTitle: "Điều khoản & Điều kiện", link: "/terms" },
    ],
  },
]

const Footer = () => {
  return (
    <>
      <footer id="footer_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="footer_wedget">
                <img src={logo} alt="logo_img" style={{ width: "60%" }} />
                <p>
                  Dẫn đầu trong dịch vụ vận tải kết nối tài xế và khách hàng.
                  Đội ngũ của chúng tôi "Luôn tận tâm, kết nối tài xế và khách
                  hàng trên mọi nẻo đường."
                </p>
                <div className="footer_social_icon">
                  <a href="#!">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#!">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#!">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#!">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 col-12">
              <div className="footer_wedget">
                {FooterItems.slice(0, 1).map((data, index) => (
                  <FooterWidget data={data} key={index} />
                ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="footer_wedget">
                {FooterItems.slice(1, 2).map((data, index) => (
                  <FooterWidget data={data} key={index} />
                ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="footer_wedget">
                <h4>Thông Tin Liên Hệ</h4>
                <div className="contact-info-footer">
                  <ul>
                    <li>
                      <i className="fas fa-map-marker-alt"></i>Quận Ngũ Hành
                      Sơn, Thành Phố Đà Nẵng
                    </li>
                    <li>
                      <i className="far fa-envelope"></i>{" "}
                      <a href="mailto:hello@demo.com"> RFTMS@gamil.com</a>
                    </li>
                    <li>
                      <i className="fas fa-phone-volume"></i>{" "}
                      <a href="tel:+0123-456-789"> +0123 456 789</a>
                    </li>
                    <li>
                      <i className="far fa-clock"></i>Thứ 2 - Thứ 7: 9:00 -
                      18:00
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

export const FooterWidget = ({ data }) => (
  <>
    <h4>{data.title}</h4>
    <ul>
      {data.links.map((datas, index) => (
        <li key={index}>
          <Link to={datas.link}>{datas.linkTitle}</Link>
        </li>
      ))}
    </ul>
  </>
)

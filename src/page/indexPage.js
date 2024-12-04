import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import HomeBanner from "../component/Home_One/Banner";
import LogisticsService from "../component/Home_One/Logistics_Services";
import HomeAbout from "../component/Home_One/About";
import OurAdvantage from "../component/Home_One/Our_Advantages";
import Testimonials from "../component/Home_One/Testimonial";
import BlogHome from "../component/Common/Blog";
import { jwtDecode } from "jwt-decode";

const IndexPage = () => {
  const history = useHistory();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", decodedToken.id);
        history.push("/");
        window.location.reload();
      } catch (error) {
        console.error("Invalid token");
        history.push("/signIn");
        window.location.reload();
      }
    }
  }, [history]);

  const handleNavigateToChat = () => {
    history.push("/chat");
  };

  return (
    <>
      <HomeBanner />
      <LogisticsService />
      <HomeAbout />
      <OurAdvantage />
      <BlogHome />
      <Testimonials />

      <ScrollLink
        onClick={handleNavigateToChat}
        className="message-icon"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <FaFacebookMessenger size={30} />
      </ScrollLink>
    </>
  );
};

export default IndexPage;

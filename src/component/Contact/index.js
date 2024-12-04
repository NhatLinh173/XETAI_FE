import React from "react";
// Import ContactForm Area
import ContactForm from "../Contact/ContactForm";
// Import ContactInfo Area
import ContactInfo from "../Contact/ContactInfo";

//ContactArea Area
const ContactDetails = () => {
  return (
    <>
      <section id="contact_area_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section_heading_center">
                <h2>Thông tin liên hệ</h2>
              </div>
            </div>
          </div>
          <div className="contact_form_info_area">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact_info_main">
                  <ContactInfo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactDetails;

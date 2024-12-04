import React from "react";
import CommonBanner from "../component/Common/Banner";
import SignUpCustomer from "../component/SignUp/signupCustomer";

const SignUpCustomerPage = () => {
  return (
    <>
      <CommonBanner heading="Đăng ký" page="Đăng Ký" />
      <SignUpCustomer heading="Tạo tài khoản" />
    </>
  );
};

export default SignUpCustomerPage;

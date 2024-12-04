import React from "react";
import CommonBanner from "../component/Common/Banner";
import SignUpForm from "../component/SignUp";

const SignUp = () => {
  return (
    <>
      <CommonBanner />
      <SignUpForm heading="Tạo tài khoản" />
    </>
  );
};

export default SignUp;

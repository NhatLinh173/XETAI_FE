import React from "react";
import CommonBanner from "../component/Common/Banner";
import AccountType from "../component/SignUp/accountType";
const AccountTypes = () => {
  return (
    <>

      <CommonBanner heading="Đăng ký tài khoản" page="Đăng ký" />
      <AccountType />
    </>
  );
};

export default AccountTypes;

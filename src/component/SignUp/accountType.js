import React from "react";
import "../../assets/css/accountType.css";
import { IoMdPerson, IoMdBusiness } from "react-icons/io";

const AccountType = () => {
  return (
    <div className="container account-type">
      <div className="account-type__header text-center my-4">
        <h2>Chọn loại tài khoản</h2>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <a href="/signup?type=personal">
            <div className="account-type__card card text-center">
              <div className="card-body">
                <IoMdPerson className="account-type__icon icon" />
                <h3 className="account-type__title card-title">Cá nhân</h3>
                <p className="account-type__text card-text">
                  Dành cho cả sử dụng cá nhân cơ bản và doanh nghiệp nhỏ
                </p>
                <ul className="account-type__list list-unstyled">
                  <li>Quy trình đăng ký nhanh chóng và đơn giản</li>
                  <li>Phạm vi phương tiện rộng</li>
                  <li>Ưu đãi và khuyến mãi đặc biệt</li>
                </ul>
              </div>
            </div>
          </a>
        </div>

        {/* <div className="col-md-6 mb-4">
          <a href="/signup?type=business">
            <div className="account-type__card card text-center">
              <div className="card-body">
                <IoMdBusiness className="account-type__icon icon" />
                <h3 className="account-type__title card-title">Doanh nghiệp</h3>
                <p className="account-type__text card-text">
                  Đăng ký để nhận các tính năng độc quyền cho doanh nghiệp hoặc
                  gửi yêu cầu của bạn, chúng ta sẽ trao đổi!
                </p>
                <ul className="account-type__list list-unstyled">
                  <li>Ví doanh nghiệp tập trung cho nhiều đồng nghiệp</li>
                  <li>Báo cáo tài chính hàng tháng</li>
                  <li>Bảo vệ hàng hóa (Premium)</li>
                  <li>Quản lý tài khoản riêng (Premium)</li>
                  <li>Bảng điều khiển phân tích web (Premium)</li>
                </ul>
              </div>
            </div>
          </a>
        </div> */}
      </div>

      <div className="account-type__footer text-center my-4">
        <p>
          Đã có tài khoản? <a href="#">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default AccountType;

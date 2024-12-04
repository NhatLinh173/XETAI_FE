import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FormInput from "../Common/FormInput";
import CustomModal from "../modal-popup/CustomModal";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const SignInForm = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();
  const history = useHistory();
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await handleLogin(identifier, password);
      if (response) {
        if (response.status === 200) {
          toast.success("Đăng Nhập Thành Công");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = () => {
    const role = "customer";
    const url = `https://xetai-be.vercel.app/auth/google?state=${role}`;
    console.log("Redirecting to:", url);
    window.open(url, "_self");
  };

  const handleFacebookLogin = () => {
    const role = "customer";
    const url = `https://xetai-be.vercel.app/auth/facebook?state=${role}`;
    window.open(url, "_self");
  };

  return (
    <>
      <section id="signIn_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="user_area_wrapper">
                <h2>{props.heading}</h2>
                <div className="user_area_form ">
                  <form id="form_signIn" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <FormInput
                          tag={"input"}
                          type={"text"}
                          name={"identifier"}
                          classes={"form-control"}
                          placeholder={"Email hoặc Số điện thoại"}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                        />
                      </div>
                      <div
                        className="form-group"
                        style={{ position: "relative" }}
                      >
                        <FormInput
                          tag={"input"}
                          type={showPassword ? "text" : "password"}
                          name={"password"}
                          classes={"form-control"}
                          placeholder={"Mật khẩu"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "20px",
                            transform: "translateY(-80%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Ghi nhớ đăng nhập
                          </label>
                        </div>
                      </div>
                      <div
                        className="col-lg-12 text-right"
                        style={{ marginBottom: "15px" }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            fontSize: "14px",
                          }}
                          onClick={() => history.push("/forgot-password")}
                        >
                          Quên mật khẩu?
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <div className="submit_button">
                          <FormInput
                            tag={"button"}
                            val={"Đăng Nhập"}
                            className="btn btn-primary btn-block"
                            style={{
                              height: "50px",
                              fontWeight: "600",
                              marginBottom: "10px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-12"
                        style={{ marginBottom: "15px" }}
                      >
                        <div>HOẶC</div>
                      </div>
                      <div className="col-lg-12">
                        <button
                          type="button"
                          className="btn btn-primary btn-block"
                          style={{
                            height: "50px",
                            backgroundColor: "#3b5898",
                            fontWeight: "600",
                            color: "#fff",
                            marginBottom: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={handleGoogleLogin}
                        >
                          <FcGoogle
                            style={{
                              marginRight: "10px",
                              fontSize: "20px",
                            }}
                          />{" "}
                          Đăng nhập với Google
                        </button>
                      </div>
                      <div className="col-lg-12">
                        <button
                          type="button"
                          className="btn btn-primary btn-block"
                          style={{
                            height: "50px",
                            backgroundColor: "#4285f4",
                            fontWeight: "600",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={handleFacebookLogin}
                        >
                          <FaFacebookF
                            style={{ marginRight: "10px", fontSize: "18px" }}
                          />{" "}
                          Đăng nhập với Facebook
                        </button>
                      </div>
                      <div className="col-lg-12">
                        <div className="not_remember_area">
                          <p>
                            Chưa là thành viên?{" "}
                            <span
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={openModal}
                            >
                              Đăng Ký
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomModal isOpen={modalIsOpen} closeModal={closeModal} />
    </>
  );
};

export default SignInForm;

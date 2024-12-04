const regexPattern = {
  fullName: /^[\p{L} .'-]+$/u,
  nameCompany: /^[\p{L} .'-]+$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/, // Số điện thoại (10-11 số)
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  confirmPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};
export default regexPattern;

export const getMenuData = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  const MenuData = [
    {
      name: "Trang chủ",
      href: "/",
      has_children: false,
    },
    {
      name:
        userRole === "personal" || userRole === "business"
          ? "Đơn Hàng"
          : "Bài Đăng", // thay đổi dựa trên vai trò
      href:
        userRole === "personal" || userRole === "business"
          ? "/order"
          : "/post-driver", // điều hướng tương ứng
      has_children: false,
    },
    {
      name: "Tin tức",
      href: "/blog_details",
      has_children: false,
    },
    {
      name: "Liên Hệ ",
      href: "/contact",
      has_children: false,
    },
    {
      name: isLoggedIn ? "" : "Đăng Nhập",
      href: isLoggedIn ? "#" : "/signIn",
      has_children: false,
    },
    ...(!isLoggedIn
      ? [
          {
            name: "Đăng Ký",
            href: "#",
            has_children: false,
          },
        ]
      : []),
  ];
  return MenuData;
};

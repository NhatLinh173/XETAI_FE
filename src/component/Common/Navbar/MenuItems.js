import React from "react";
import { Link } from "react-router-dom";

const MenuItems = ({ item, openModal }) => {
  const handleClick = (event) => {
    if (item.name === "Đăng Ký") {
      event.preventDefault();
      console.log(item.name);
      openModal();
      console.log(openModal);
    }
  };

  return (
    <li className="nav-item">
      <Link to={item.href} className="nav-link" onClick={handleClick}>
        {item.name}
        {item.has_children && <i className="fas fa-angle-down"></i>}
      </Link>
      {item.has_children && (
        <ul className="dropdown-menu">
          {item.children.map((childItem, index) => (
            <MenuItems item={childItem} key={index} openModal={openModal} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItems;

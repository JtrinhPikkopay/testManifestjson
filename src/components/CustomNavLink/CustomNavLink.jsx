import React from "react";
import { NavLink } from "react-router-dom";

const CustomNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "text-white cursor-default underline" : "hover:underline"
      }
    >
      {children}
    </NavLink>
  );
};

export default CustomNavLink;

import React from "react";
import CustomNavLink from "../CustomNavLink/CustomNavLink";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // router
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between p-4 md:p-6 bg-sky-400">
      <h2
        className="font-semibold cursor-pointer md:text-xl lg:text-2xl"
        onClick={navigateHome}
      >
        Scandit
      </h2>
      <div className="flex gap-3">
        <CustomNavLink to="/">Home</CustomNavLink>
        <CustomNavLink to="/scan">Scan</CustomNavLink>
      </div>
    </div>
  );
};

export default Header;

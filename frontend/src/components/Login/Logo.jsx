// src/components/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="absolute top-4 left-4 z-50">
      <img
        src="/logo.png"
        alt="Unessa Foundation Logo"
        className="w-32 h-32 opacity-90  flex items-center drop-shadow-md hover:opacity-100 transition "
      />
    </Link>
  );
};

export default Logo;

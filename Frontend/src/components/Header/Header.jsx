import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2 data-test="header-2-text">
          Feeling hungry? Order your favorite dishes below!
        </h2>
        <p data-test="header-p-text">
          Explore our diverse menu, featuring an exquisite selection of dishes
          crafted with the utmost excellence.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;

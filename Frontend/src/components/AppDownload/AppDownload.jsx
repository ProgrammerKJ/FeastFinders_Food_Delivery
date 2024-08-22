import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For The Most Optimal Experience Download <br />
        Feast Finder App
      </p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="Google Play" />
        <img src={assets.app_store} alt="App Store" />
      </div>
    </div>
  );
};

export default AppDownload;

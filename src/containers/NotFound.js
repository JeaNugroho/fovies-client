import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="NotFound">
        <h3>Sorry, Page..</h3>
        <img className="notfound-img" src="https://httpstatusdogs.com/img/404.jpg" alt="Sorry, page not found!" />
    </div>
  );
}

export default NotFound;
import React from "react";
import brandPic from "../fovies_pic_logo-removebg-preview.png";
import brandName from "../fovies_name_logo-removebg-preview.png";
import "./Home.css";

const Home = () => {
    return (
        <div className="Home">
            <div className="lander">
                <img className="brand-pic" src={ brandPic } alt="fovies-pic-logo" />
                <img className="brand-name" src={ brandName } alt="fovies-name-logo" />
                <p className="pt-3">Super Short Films</p>
            </div>
        </div>
    );
}

export default Home;
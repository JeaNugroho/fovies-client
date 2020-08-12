import React, { useState, useEffect } from "react";
import { ListGroup, Media } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import brandPic from "../fovies_pic_logo-removebg-preview.png";
import brandName from "../fovies_name_logo-removebg-preview.png";
import "./Home.css";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                let videos = await loadVideos();

                videos = videos.reverse();

                setVideos(videos);
            } catch (error) {
                onError(error);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadVideos() {
        return API.get("fovies", "/users/all/videos");
    }

    function renderVideosList(videos) {
        return videos.map((video, i) => 
            (<LinkContainer key={ video.videoId } to={ `/users/one/videos/${video.videoId}` }>
                <ListGroup.Item>
                    <Media>
                            <img
                                className="poster mr-3"
                                src={ video.posterUrl }
                                alt={ `poster-${video.title}` }
                            />
                            <Media.Body>
                                <h4>{ video.title }</h4>
                                <div>
                                    <img className="avatar rounded-circle my-auto" src={ video.avatar } alt="avtr" />{" "}<p className="d-inline-block my-auto">{ video.createdAt }</p>
                                </div>
                            </Media.Body>
                    </Media>
                </ListGroup.Item>
            </LinkContainer>)
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <img className="brand-pic" src={ brandPic } alt="fovies-pic-logo" />
                <img className="brand-name" src={ brandName } alt="fovies-name-logo" />
                <p className="pt-3">Super Short Films</p>
            </div>
        );
    }

    function renderVideos() {
        return (
            <div className="videos pt-5 mb-5">
                <h1>All Movies</h1>
                <hr />
                <ListGroup>
                    { !isLoading && renderVideosList(videos) }
                </ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            { isAuthenticated ? renderVideos() : renderLander() }
        </div>
    );
}

export default Home;
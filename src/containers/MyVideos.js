import React, { useState, useEffect } from "react";
import { Media } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { ListGroup } from "react-bootstrap";
import "./MyVideos.css";

export default function MyVideos() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            try {
                const videos = await loadVideos();

                setVideos(videos);
            } catch (error) {
                onError(error);
            }

            setIsLoading(false);
        }

        onLoad();
    }, []);

    function loadVideos() {
        return API.get("fovies", "/users/me/videos");
    }

    function renderVideosList(videos) {
        return [{}].concat(videos).map((video, i) => 
            i !== 0 ? (
                <LinkContainer key={ video.videoId } to={ `/users/me/videos/${video.videoId}` }>
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
                </LinkContainer>
            ) : (
                <LinkContainer key="new" to="/users/me/videos/new">
                    <ListGroup.Item>
                        <Media as="li" to="/users/me/videos/new">
                            <i className="fas fa-plus-circle fa-2x my-auto mr-3" />
                            <h4 className="my-auto">Upload New Movie</h4>
                        </Media>
                    </ListGroup.Item>
                </LinkContainer>
            )
        );
    }

    return(
        <div className="MyVideos pt-5 mb-5">
            <h1>Your Movies</h1>
            <hr />

            <ListGroup className="videos">
                { !isLoading && renderVideosList(videos) }
            </ListGroup>
        </div>
    );
}
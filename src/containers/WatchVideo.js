import React, { useState, useEffect } from "react";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { useParams } from "react-router-dom";
import { s3Download } from "../libs/awsLib";
import "./WatchVideo.css";

export default function WatchVideo() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [movie, setMovie] = useState("");

    useEffect(() => {
        function loadVideo() {
            return API.get("fovies", `/users/one/videos/${id}`)
        }

        async function onLoad() {
            try {
                const video = await loadVideo();

                const movie = await s3Download(video.movieKey);
                setMovie(movie);

                setVideo(video);
            } catch (error) {
                onError(error);
            }
        }

        onLoad();
    }, []);

    return(
        ( video && <div className="WatchVideo pt-4">
            <video
              id="my-video"
              className="video-js mx-auto mb-4"
              controls
              preload="auto"
              poster={ video.posterUrl }
              data-setup="{}"
            >
              <source src={ movie } type="video/mp4" />
              <source src={ movie } type="video/webm" />
              <source src={ movie } type="video/ogg" />
              <p className="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">
                  supports HTML5 video
                </a>
              </p>
            </video>
            <script src="https://vjs.zencdn.net/7.8.4/video.js"></script>

            <h4>{ video.title }</h4>
            <p>{ video.description }</p>
        </div>)
    );
}
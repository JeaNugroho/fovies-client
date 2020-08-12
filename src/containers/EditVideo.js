import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import LoaderButton from "../components/LoaderButton";
import { Form } from "react-bootstrap";
import config from "../config";
import "./EditVideo.css";
import { s3Download, s3Upload, s3Delete } from "../libs/awsLib";

export default function EditVideo() {
  const movie = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadVideo() {
      return API.get("fovies", `/users/me/videos/${id}`);
    }

    async function onLoad() {
      try {
        const video = await loadVideo();
        const { title, description, movieKey, posterUrl } = video;

        // video.movie = await Storage.vault.get(movieKey);
        video.movie = await s3Download(movieKey);
        // video.poster = await Storage.vault.get(posterKey);

        setVideo(video);
        setTitle(title);
        setDescription(description);
        setPosterUrl(posterUrl);
      } catch (error) {
        onError(error);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return title.length > 0 && description.length > 0 && posterUrl.length > 0;
  }

  function formatFilename(str) {
    return str.substring(36);
  }

  function handleMovieChange(event) {
    movie.current = event.target.files[0];
  }

  function saveVideo(video) {
    return API.put("fovies", `/users/me/videos/${id}`, {
      body: video
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (movie.current && movie.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Your file size is ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.\n
        Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    let movieKey;

    try {
      if (movie.current) {
        movieKey = await s3Upload(movie.current);
        await s3Delete(video.movieKey);
      }

      await saveVideo({
        title,
        description,
        movieKey: movieKey || video.movieKey,
        posterUrl
      });
      history.push("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  function deleteVideo() {
    return API.del("fovies", `/users/me/videos/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Please confirm to delete this movie upload..."
    );

    if (!confirmed) {
        return;
    }

    setIsDeleting(true);

    try {
      await s3Delete(video.movieKey);
      await deleteVideo();
      history.push("/");
    } catch (error) {
      onError(error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="EditVideo pt-4">
      { video && (
        <Form className="pb-5" onSubmit={ handleSubmit }>
          <Form.Label className="d-block">
            <strong>PREVIOUS FILES</strong>
            <hr className="mt-1" />
          </Form.Label>
          <Form.Group>
            <a
              className="d-block"
              target="_blank"
              rel="noopener noreferrer"
              href={ video.posterUrl }
            >
              <i className="fas fa-file-image"></i>{" "}
              <p className="d-inline-block mb-1">Poster</p>
              <br />
              <img
                className="poster d-inline-block"
                src={ video.posterUrl }
                alt="poster"
              />
            </a>
          </Form.Group>
          <Form.Group>  
            <a
              className="d-block"
              target="_blank"
              rel="noopener noreferrer"
              href={ video.movie }
            >
              <i className="fas fa-file-video mb-1"></i>{" "}{ formatFilename(video.movieKey) }
            </a>
            <video
              id="my-video"
              className="video-js"
              controls
              preload="auto"
              width="640"
              height="264"
              // poster="MY_VIDEO_POSTER.jpg"
              data-setup="{}"
            >
              <source src={ video.movie } type="video/mp4" />
              <source src={ video.movie } type="video/webm" />
              <source src={ video.movie } type="video/ogg" />
            </video>
            <script src="https://vjs.zencdn.net/7.8.4/video.js"></script>
          </Form.Group>

          <Form.Label className="pt-4 d-block">
            <strong>NEW UPDATES</strong>
            <hr className="mt-1" />
          </Form.Label>
          <Form.Group>
            <Form.Label><strong>Movie</strong></Form.Label>
            <Form.Control onChange={ handleMovieChange } type="file" />
          </Form.Group>
          <Form.Group>
            <Form.Control
              value={ posterUrl }
              placeholder="Poster URL"
              onChange={ e => setPosterUrl(e.target.value) }
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              value={ title }
              placeholder="Title"
              onChange={ e => setTitle(e.target.value) }
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              className="textarea"
              value={ description }
              placeholder="Description"
              onChange={ e => setDescription(e.target.value) }
            />
          </Form.Group>

          <LoaderButton
            block
            type="submit"
            className="btn btn-lg"
            isLoading={ isLoading }
            disabled={ !validateForm() }
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            className="btn btn-lg btn-danger"
            onClick={ handleDelete }
            isLoading={ isDeleting }
          >
            Delete
          </LoaderButton>
        </Form>
      ) }
    </div>
  );
}
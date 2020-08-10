import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../libs/hooksLib";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
// import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewVideo.css";
import { API } from "aws-amplify";
import { s3Upload, s3Download } from "../libs/awsLib";

export default function NewVideo() {
  // const { thisUserGravatar } = useAppContext();
  const movie = useRef(null);
  const [movieFilled, setMovie] = useState(false);
  // const poster = useRef(null);
  // const [posterFilled, setPoster] = useState(false);
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    description: "",
    posterUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log(thisUserGravatar);
  // }, []);

  function validateForm() {
    return fields.title.length > 0 && fields.description.length > 0 && fields.posterUrl.length > 0 && movieFilled;
  }

  function handleMovieChange(event) {
    movie.current = event.target.files[0];
    setMovie(true);
  }

  // function handlePosterChange(event) {
  //   poster.current = event.target.files[0];
  //   setPoster(true);
  // }

  async function handleSubmit(event) {
    event.preventDefault();

    // CHANGE MAX SIZE IF NECESSARY
    if (movie.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Your file size is ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.\n
        Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const movieKey = await s3Upload(movie.current);
      // const posterKey = await s3Upload(poster.current);
      // const posterUrl = await s3Download(posterKey);

      const title = fields.title;
      const description = fields.description;
      const posterUrl = fields.posterUrl;
      const avatar = localStorage.getItem("currentUserAvatar");

      await createVideo({ title, description, movieKey, posterUrl, avatar });
      history.push("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  function createVideo(video) {
    return API.post("fovies", "/users/me/videos", {
      body: video
    });
  }

  return (
    <div className="NewNote">
      <Form className="pt-4" onSubmit={ handleSubmit }>
        <Form.Group>
          <Form.Label><strong>Movie</strong></Form.Label>
          <Form.Control onChange={ handleMovieChange } type="file" />
        </Form.Group>
        <Form.Group>
          <Form.Control
            name="posterUrl"
            placeholder="Poster URL"
            value={ fields.posterUrl }
            onChange={ handleFieldChange }
          />
        </Form.Group>
        {/* <Form.Group>
          <Form.Label><strong>Poster</strong></Form.Label>
          <Form.Control onChange={ handlePosterChange } type="file" />
        </Form.Group> */}
        <Form.Group>
          <Form.Control
            name="title"
            placeholder="Title"
            value={ fields.title }
            onChange={ handleFieldChange }
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Description"
            value={ fields.description }
            className="textarea"
            onChange={ handleFieldChange }
          />
        </Form.Group>

        <Form.Group>
          <LoaderButton
            block
            className="btn btn-lg"
            type="submit"
            isLoading={isLoading}
            disabled={ !validateForm() }
          >
            Create
          </LoaderButton>
        </Form.Group>
      </Form>
    </div>
  );
}
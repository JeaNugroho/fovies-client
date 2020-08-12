import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import gravatar from "gravatar";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Login.css";

const Login = () => {
  // const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        await Auth.signIn(fields.email, fields.password);
        
        const thisUserAvatar = gravatar.url(fields.email, {
          s: "200",
          r: "pg",
          d: "mm"
        });
        localStorage.setItem("currentUserAvatar", thisUserAvatar);

        userHasAuthenticated(true);

        // history.push("/");
    } catch (error) {
        onError(error);
        setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={ handleSubmit }>
        <Form.Group>
          <Form.Label><strong>Email</strong></Form.Label>
          <Form.Control 
            className="form-control form-control-lg"
            autoFocus
            type="email"
            name="email"
            value={ fields.email }
            onChange={ handleFieldChange }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label><strong>Password</strong></Form.Label>
          <Form.Control 
            className="form-control form-control-lg"
            name="password"
            value={ fields.password }
            onChange={ handleFieldChange }
            type="password"
          />
        </Form.Group>
        
        <LoaderButton className="btn btn-lg" block disabled={ !validateForm() } isLoading={ isLoading } type="submit">
          Log In
        </LoaderButton>
      </Form>
    </div>
  );
}

export default Login;
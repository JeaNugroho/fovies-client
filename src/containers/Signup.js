import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });

      setIsLoading(false);
      setNewUser(newUser);
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group>
          <Form.Label><strong>Confirmation Code</strong></Form.Label>
          <Form.Control
            className="form-control form-control-lg"
            autoFocus
            type="tel"
            name="confirmationCode"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text className="text-muted">
            Please check your email for the code
          </Form.Text>
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label><strong>Email</strong></Form.Label>
          <Form.Control
            className="form-control form-control-lg"
            autoFocus
            type="email"
            name="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label><strong>Password</strong></Form.Label>
          <Form.Control
            className="form-control form-control-lg"
            type="password"
            name="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label><strong>Confirm Password</strong></Form.Label>
          <Form.Control
            className="form-control form-control-lg"
            type="password"
            name="confirmPassword"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          className="btn btn-lg"
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
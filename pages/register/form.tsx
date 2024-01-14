"use client";

import React, { FormEvent, useState } from "react";

type FlexDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse"
  | undefined;

export default function Form() {
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginTop: "50px",
  };

  const inputStyle: React.CSSProperties = {
    marginBottom: "10px",
    padding: "8px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  };

  const [action, setAction] = useState<"register" | "login">("register");

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (action === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      console.log({ response });
    } else if (action === "login") {
      const response = await fetch(`/api/auth/register`, {
        method: "GET",
        body: JSON.stringify({
          email: formatData.get("email"),
          password: formData.get("password"),
        }),
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} style={formStyle}>
      <input name="email" type="email" style={inputStyle} placeholder="Email" />
      <input
        name="password"
        type="password"
        style={inputStyle}
        placeholder="Password"
      />
      <button
        type="submit"
        style={buttonStyle}
        onClick={() => setAction("register")}
      >
        Register
      </button>
      <button
        type="submit"
        style={buttonStyle}
        onClick={() => setAction("login")}
      >
        Login
      </button>
    </form>
  );
}

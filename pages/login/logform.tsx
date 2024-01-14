"use client";

import React, { FormEvent } from "react";
import {signIn} from 'next-auth/react';
import { redirect } from "next/dist/server/api-utils";

type FlexDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse"
  | undefined;

export default function LogForm() {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });    

  };
  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input name="email" type="email" style={inputStyle} placeholder="Email" />
      <input name="password" type="password" style={inputStyle} placeholder="Password" />
      <button type="submit" style={buttonStyle}>
        Log In
      </button>
    </form>
  );
}

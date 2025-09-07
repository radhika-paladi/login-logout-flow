import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  return (
    <div className="page-card">
      <h2 className="page-text">Welcome to Klickks!</h2>
      {user ? (
        <p className="paragraph">Logged in as <strong>{user.email}</strong></p>
      ) : (
        <p className="paragraph">
          You are not logged in. <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Register</Link> to get started.
        </p>
      )}
    </div>
  );
}

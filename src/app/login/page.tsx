"use client";
import apiCall from "@/helpers/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../components/Button";
import "./style.scss";

const Login = () => {
  const [email, setEmail] = useState("test@demo.com");
  const [password, setPassword] = useState("Test@123");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Please enter your email");
    }

    if (!password) {
      setPasswordError("Please enter your password");
    }

    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      const loginData = await apiCall("auth/login", "POST", {
        email,
        password,
      });
      if (remember) {
        Cookies.set("user", JSON.stringify(loginData.data), { expires: 7 });
      } else {
        Cookies.set("user", JSON.stringify(loginData.data));
      }

      router.push("/movies");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-main">
      <div className="auth-screen">
        <h1 className="auth-title">Sign in</h1>
        <form>
          <div className="form-group">
            <input
              type="email"
              className={`form-control    ${
                emailError && " !border-rose-500"
              } `}
              placeholder="Email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="error-message text-rose-500 py-2">{emailError}</p>
            )}
          </div>
          <div className={`form-group`}>
            <input
              type="password"
              className={`form-control    ${
                passwordError && " !border-rose-500"
              } `}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            {passwordError && (
              <p className="error-message text-rose-500 py-2">
                {passwordError}
              </p>
            )}
          </div>

          <div className="form-check">
            <input
              className="form-check-input !mt-0"
              type="checkbox"
              defaultValue=""
              id="flexCheckChecked2"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="flexCheckChecked2">
              Remember me
            </label>
          </div>
          <Button isLoading={loading} label={"Login"} onClick={login}></Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

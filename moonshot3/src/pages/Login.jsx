import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onFinishLogin = async (values) => {
    try {
      const response = await axios.post(
        `https://moonshot-6jhr.onrender.com/auth/login`,
        values
      );
      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      console.log(response);
      localStorage.setItem("username", response.data.username);
      navigate("/dashboard");
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const onFinishSignup = async (values) => {
    try {
      const response = await axios.post(
        `https://moonshot-6jhr.onrender.com/auth/signup`,
        values
      );
      toast.success(response.data.message);
      console.log(response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Toaster />
      <h2>Moonshot analytics</h2>
      <Form
        style={{ width: "300px" }}
        name={isLogin ? "login_form" : "signup_form"}
        className="form"
        initialValues={{
          remember: true,
        }}
        onFinish={isLogin ? onFinishLogin : onFinishSignup}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {!isLogin && (
          <Form.Item
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="form-button">
            {isLogin ? "Log in" : "Sign up"}
          </Button>{" "}
          &nbsp; Or &nbsp;
          <a onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " register now!" : "login now!"}
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

// src/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/create",
        {
          userName,
          password,
          rfid,
        }
      );
      console.log("User registered:", response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  // Function to navigate to login page
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-96 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-blue-600">
          Đăng Ký Tài Khoản
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Tên người dùng
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">RFID</label>
          <input
            type="text"
            value={rfid}
            onChange={(e) => setRfid(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đăng Ký
        </button>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            Đã có tài khoản? Đăng Nhập
          </button>
        </div>
      </form>
    </div>
  );
}

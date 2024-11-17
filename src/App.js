import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./User/register";
import Login from "./User/login";
import RFIDList from "./User/rfid";
import Role_User from "./User/Role_User";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rfid" element={<RFIDList />} />
      <Route path="/role_user" element={<Role_User />} />
    </Routes>
  );
}

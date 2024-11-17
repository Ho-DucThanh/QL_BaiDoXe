import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import database from "../config"; // Firebase database config
import { ref, onValue } from "firebase/database";

const RoleUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // User data
  const [parkingData, setParkingData] = useState(null); // Firebase data
  const [monthlyPassData, setMonthlyPassData] = useState(null); // Monthly pass data

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Nếu không có user, chuyển về login
    }
  }, [navigate]);

  useEffect(() => {
    // Lắng nghe dữ liệu từ Firebase
    const parkingRef = ref(database, "/parking_data");
    onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      setParkingData(data);
    });

    // Lấy dữ liệu thẻ tháng từ Firebase
    const monthlyPassRef = ref(database, "/monthly_pass");
    onValue(monthlyPassRef, (snapshot) => {
      const data = snapshot.val();
      setMonthlyPassData(data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin user khỏi localStorage
    navigate("/login");
  };

  if (!userData || !parkingData || !monthlyPassData) return null;

  // Tìm thông tin thẻ dựa trên RFID
  const parkingInfo = parkingData[userData.rfid] || {};
  const monthlyPassInfo = monthlyPassData[userData.rfid] || {}; // Kiểm tra thẻ tháng

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 space-y-6 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          Đăng Xuất
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-600">
          Thông Tin Thẻ
        </h2>

        <div className="space-y-4">
          {/* Hiển thị thông tin người dùng */}
          <div className="flex justify-between items-center">
            <label className="text-gray-700">User Name</label>
            <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
              {userData.userName}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-gray-700">ID thẻ</label>
            <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
              {userData.rfid || "Không có"}
            </p>
          </div>

          {/* Kiểm tra và hiển thị thông tin thẻ tháng nếu có */}
          {monthlyPassInfo && Object.keys(monthlyPassInfo).length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Thời gian vào</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.entry_time || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Thời gian ra</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.exit_time || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Ngày đăng ký</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.registration_date || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Ngày hết hạn</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.expiry_date || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Trạng thái</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.status || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Số lần quét</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {monthlyPassInfo.swipe_count || 0}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Thời gian vào</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {parkingInfo.entry_time || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Thời gian ra</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {parkingInfo.exit_time || "Chưa có"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Số lần quét</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {parkingInfo.swipe_count || 0}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Tổng số tiền</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {parkingInfo.total_amount || 0} VND
                </p>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-700">Trạng thái</label>
                <p className="text-gray-600 border p-2 rounded-md w-40 text-right">
                  {parkingInfo.swipe_count % 2 === 0
                    ? "Đã ra khỏi cổng"
                    : "Đang vào cổng"}
                </p>
              </div>
            </>
          )}
        </div>

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default RoleUser;

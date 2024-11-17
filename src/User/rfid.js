import React, { useState, useEffect } from "react";
import database from "../config";
import { ref, onValue, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RFIDList() {
  const [cards, setCards] = useState([]);
  const [monthlyPass, setMonthlyPass] = useState({});
  const [parkingSpots, setParkingSpots] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCards(Array.isArray(parsedUser) ? parsedUser : []);
    } else {
      navigate("/login"); // Nếu không có user, chuyển về login
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin user khỏi localStorage
    navigate("/login");
  };

  useEffect(() => {
    const cardRef = ref(database, "/parking_data");
    onValue(cardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cardArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCards(cardArray);
      }
    });

    const monthlyPassRef = ref(database, "/monthly_pass");
    onValue(monthlyPassRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMonthlyPass(data);
      }
    });

    const parkingSpotsRef = ref(database, "/parking_spots");
    onValue(parkingSpotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParkingSpots(data);
      }
    });
  }, []);

  const handleDelete = (cardId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa thẻ này không?"
    );
    if (confirmDelete) {
      const cardRef = ref(database, `/parking_data/${cardId}`);
      remove(cardRef);
    }
  };

  const getStatus = (swipeCount) => {
    return swipeCount % 2 === 0 ? "Đã ra khỏi cổng" : "Đã vào cổng";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Quản lý thẻ và bãi đỗ xe
      </h1>
      <div className="flex justify-center mb-4">
        <div className="flex justify-center flex-grow space-x-2">
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 ${
              activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Thẻ ngày
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-4 py-2 ${
              activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Thẻ tháng
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`px-4 py-2 ${
              activeTab === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Bãi đỗ xe
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-auto"
        >
          Đăng xuất
        </button>
      </div>

      {activeTab === 1 && (
        <div>
          <h2 className="text-xl mb-3 font-bold">Danh sách các thẻ ngày</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Thẻ</th>
                <th className="py-3 px-6 text-left">Số lần quẹt</th>
                <th className="py-3 px-6 text-left">Thời gian vào</th>
                <th className="py-3 px-6 text-left">Thời gian ra</th>
                <th className="py-3 px-6 text-left">Số tiền (VND)</th>
                <th className="py-3 px-6 text-left">Trạng thái</th>
                <th className="py-3 px-6 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {cards.map((card) => (
                <tr
                  key={card.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{card.id}</td>
                  <td className="py-3 px-6">{card.swipe_count}</td>
                  <td className="py-3 px-6">{card.entry_time || "Chưa vào"}</td>
                  <td className="py-3 px-6">{card.exit_time || "Chưa ra"}</td>
                  <td className="py-3 px-6">{card.total_amount || 0}</td>
                  <td className="py-3 px-6">{getStatus(card.swipe_count)}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 2 && (
        <div>
          <h2 className="text-xl mb-3  font-bold">Thông tin thẻ tháng</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Thẻ</th>
                <th className="py-3 px-6 text-left">Thời gian vào</th>
                <th className="py-3 px-6 text-left">Thời gian ra</th>
                <th className="py-3 px-6 text-left">Ngày hết hạn</th>
                <th className="py-3 px-6 text-left">Ngày đăng ký</th>
                <th className="py-3 px-6 text-left">Trạng thái</th>
                <th className="py-3 px-6 text-left">Số lần quẹt</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {Object.keys(monthlyPass).map((key) => (
                <tr
                  key={key}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{key}</td>
                  <td className="py-3 px-6">{monthlyPass[key].entry_time}</td>
                  <td className="py-3 px-6">{monthlyPass[key].exit_time}</td>
                  <td className="py-3 px-6">{monthlyPass[key].expiry_date}</td>
                  <td className="py-3 px-6">
                    {monthlyPass[key].registration_date}
                  </td>
                  <td className="py-3 px-6">{monthlyPass[key].status}</td>
                  <td className="py-3 px-6">{monthlyPass[key].swipe_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <h2 className="text-xl mb-3 font-bold">Thông tin chỗ đậu xe</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Chỗ Đậu</th>
                <th className="py-3 px-6 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {Object.keys(parkingSpots).map((key) => (
                <tr
                  key={key}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">{key}</td>
                  <td className="py-3 px-6">{parkingSpots[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RFIDList;

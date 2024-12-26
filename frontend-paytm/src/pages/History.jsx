import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../constant/constant";

const History = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Redirect to signin if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BaseURL}/api/v1/account/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(response.data.data.transactions);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching history."
      );
      navigate("/signin");
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-slate-200">
      <div className="bg-white my-10 p-10 w-[95%] rounded-lg">
        <div className="text-4xl font-bold border-b-2 mb-4">
          Transactions History
        </div>
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No transactions found.
          </div>
        ) : (
          history.map((trans, index) => (
            <div
              className="flex justify-between py-3 px-2 items-center shadow rounded-md mt-3 "
              key={index}
            >
              <div className="flex items-center ">
                <div className="rounded-full h-16 w-16 bg-gray-400 text-white flex justify-center items-center font-semibold text-3xl">
                  {trans.status === "Received"
                    ? trans.userBy.firstName[0].toUpperCase()
                    : trans.receiverBy.firstName[0].toUpperCase()}
                </div>
                <div className="flex flex-col px-3">
                  <div className="text-sm text-gray-500">
                    {trans.status === "Received" ? "Received From" : "Paid To"}
                  </div>
                  <div className="font-semibold text-lg text-gray-800">
                    {trans.status === "Received"
                      ? `${trans.userBy.firstName} ${trans.userBy.lastName}`
                      : `${trans.receiverBy.firstName} ${trans.receiverBy.lastName}`}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="font-semibold text-lg">Rs {trans.amount}</div>
                <div className="text-sm text-gray-500">{trans.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;

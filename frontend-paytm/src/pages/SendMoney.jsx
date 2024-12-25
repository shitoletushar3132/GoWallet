import React, { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../constant/constant";

const SendMoney = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const name = params.get("name");
  const [amount, setAmount] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const SendMoney = async () => {
    if (!token) {
      alert("You are not authorized. Please sign in.");
      navigate("/signin");
      return;
    }

    if (amount >= 1) {
      try {
        const response = await axios.post(
          `${BaseURL}/api/v1/account/transfer`,
          { to: id, amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAmount(0);
        alert("Money transferred successfully!");
        navigate("/dashboard");
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "An error occurred during the transfer."
        );
        navigate("/signin"); // Redirect if token is invalid
      }
    } else {
      alert("Enter a valid amount.");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100">
      <div className="h-full w-full flex justify-center items-center">
        <div className="shadow-lg text-center w-96 bg-white rounded-xl flex flex-col justify-center items-center p-8">
          <Heading label={"Send Money"} />
          <div className="flex items-center mt-8">
            <div className="rounded-full h-16 w-16 bg-green-500 text-white flex justify-center items-center font-semibold text-xl">
              {name[0].toUpperCase()}
            </div>
            <div className="flex flex-col justify-center ml-4 font-semibold text-2xl text-gray-800">
              {name}
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="flex flex-col mb-4">
              <label className="text-gray-700 text-lg font-medium">
                Amount (in Rs)
              </label>
              <input
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter amount"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              onClick={SendMoney}
              className="w-full py-3 mt-4 text-center bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:ring-4 focus:ring-green-300"
            >
              Initiate Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;

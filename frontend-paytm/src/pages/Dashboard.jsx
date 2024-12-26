import React, { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../constant/constant";
import { FaHistory } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate("/signin"); // Correct navigation path
      return;
    }

    const callApi = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/v1/account/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data.Balance);
      } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
        navigate("/signin"); // Correct navigation path
      }
    };

    callApi();
  }, [token, navigate]); // Add 'token' and 'navigate' as dependencies

  return (
    <div>
      <Appbar />
      <div className="m-7 ">
        <div className=" flex justify-between items-center underline pb-2">
          <Balance value={balance} />
          <Link to={"/history"} className="cursor-pointer">
            <FaHistory size={20} />
          </Link>
        </div>

        <Users />
      </div>
    </div>
  );
};

export default Dashboard;

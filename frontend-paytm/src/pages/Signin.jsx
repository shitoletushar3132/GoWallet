import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeadling from "../components/SubHeadling";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import axios from "axios";
import { BaseURL } from "../constant/constant";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const sign = async () => {
    try {
      const response = await axios.post(`${BaseURL}/api/v1/user/signin`, {
        userName,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("WalletUser", response.data.name);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-96 text-center px-6 pb-7">
          <Heading label={"Sign In"} />
          <SubHeadling label={"Enter your credentials to Access your Wallet"} />

          <InputBox
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder={"JohnWick_12"}
            label={"UserName"}
          />

          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder={"@John123"}
            label={"Password"}
          />

          <div className="pt-4">
            <Button label={"Sign In"} onClick={sign} />
          </div>
          <BottomWarning
            label={"Don't have a Wallet"}
            to={"/signup"}
            bottonText={"Sign Up"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;

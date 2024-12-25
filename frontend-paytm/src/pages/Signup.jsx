import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeadling from "../components/SubHeadling";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import axios from "axios";
import { BaseURL } from "../constant/constant";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const signUpCall = async () => {
    try {
      const response = await axios.post(`${BaseURL}/api/v1/user/signup`, {
        userName,
        firstName,
        lastName,
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
          <Heading label={"Sign up"} />
          <SubHeadling label={"Enter your information to create the Wallet"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder={"John"}
            label={"First Name"}
          />

          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={"Wick"}
            label={"Last Name"}
          />

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
            <Button label={"Sign up"} onClick={signUpCall} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            to={"/signin"}
            bottonText={"Sign In"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;

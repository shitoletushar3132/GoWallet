import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../constant/constant";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${BaseURL}/api/v1/user/bulk?filter=${search}`)
      .then((res) => setUsers(res.data.users));
  }, [search]);
  return (
    <div>
      <form className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-900"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Users ..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>
      {users.map((user) => (
        <div
          className="flex justify-between items-center mt-10 shadow-sm rounded-md px-3"
          key={user._id}
        >
          <div className="flex mr-4 items-center">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex  flex-col justify-center text-center m-1 font-semibold">
              {user.firstName.charAt(0)}
            </div>
            <div className="flex flex-col justify-center h-full mr-3 font-semibold">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <Link to={`/send?id=${user._id}&name=${user.firstName}`}>
            <Button label={"send Money"} />
          </Link>
        </div>
      ))}
    </div>
  );
};

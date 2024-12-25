import React from "react";

const Appbar = () => {
  const name = localStorage.getItem("WalletUser") || "hello";

  return (
    <div className="shadow h-16 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4 font-semibold">
        Go Wallet
      </div>
      <div className="flex mr-4 items-center">
        <div className="flex flex-col justify-center h-full mr-3">
          Hello, {name}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex  flex-col justify-center text-center m-1">
          {name[0].toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Appbar;

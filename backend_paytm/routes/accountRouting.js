const express = require("express");
const { User, Account, Transaction } = require("../models");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const account = await Account.findOne({ userId: userId });

    res.status(200).json({
      Balance: parseFloat(account.balance).toFixed(2),
      Message: `Success for ${userId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error....Try Again" });
  }
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { amount, to } = req.body;

    if (amount < 1 || !amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Enter a Valid Amount" });
    }

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid Account" });
    }

    // Update balances
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Create transaction record within the same session
    await Transaction.create(
      [{ userBy: req.userId, receiverBy: to, amount: amount }],
      {
        session,
      }
    );

    await session.commitTransaction();
    res.status(201).json({ message: "Transfer Successfully" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    res.status(500).json({ message: "Something went Wrong" });
  } finally {
    session.endSession();
  }
});

accountRouter.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const hisData = await Transaction.find({ userBy: userId })
      .populate({
        path: "userBy",
        select: "-password",
      })
      .populate({
        path: "receiverBy",
        select: "-password",
      });

    res.status(200).json({
      message: "Successful fetch data",
      data: { tansactions: hisData },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong....!" });
  }
});

module.exports = accountRouter;

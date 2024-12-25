const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://tusharshitole6767:%40Tshitole3132@userbook.up8qm.mongodb.net/paytm";

async function connectToDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const transactionsSchema = new mongoose.Schema({
  userBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Transaction = mongoose.model("Transaction", transactionsSchema);

module.exports = { connectToDB, User, Account, Transaction };

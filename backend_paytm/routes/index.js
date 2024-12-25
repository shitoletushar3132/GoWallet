const express = require("express");
const userRouter = require("./userRouting");
const accountRouter = require("./accountRouting");

const router = express.Router();

router.use("/user", userRouter);

router.use("/account", accountRouter);

module.exports = router;

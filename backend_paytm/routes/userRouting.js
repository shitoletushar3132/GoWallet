const { User, Account } = require("../models");
const zod = require("zod");
const jwt = require("jsonwebtoken");

const express = require("express");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const userRouter = express.Router();

const signUpSchema = zod.object({
  userName: zod
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must not exceed 30 characters." })
    .transform((val) => val.trim().toLowerCase()), // Ensures trimmed, lowercase username
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }) // Minimum password length
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    }) // Uppercase letter
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    }) // Lowercase letter
    .regex(/[0-9]/, { message: "Password must contain at least one digit." }) // Digit
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    }), // Special character
  firstName: zod
    .string()
    .min(1, { message: "First name is required." }) // Ensure not empty
    .max(50, { message: "First name must not exceed 50 characters." }),
  lastName: zod
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name must not exceed 50 characters." }),
});

const updateBody = zod.object({
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit." })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  firstName: zod
    .string()
    .min(1, { message: "First name is required." })
    .max(50, { message: "First name must not exceed 50 characters." })
    .optional(),
  lastName: zod
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name must not exceed 50 characters." })
    .optional(),
});

userRouter.post("/signup", async (req, res) => {
  const body = req.body;

  try {
    const { success, error } = signUpSchema.safeParse(body);

    if (!success) {
      return res.status(409).json({ message: error.issues[0].message });
    }

    const user = await User.findOne({
      userName: body.userName,
    });

    if (user) {
      res
        .status(409)
        .json({ message: "Usename Already Taken / Incorrect Inputs" });
    } else {
      const dbUser = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      const userId = dbUser._id;

      await Account.create({
        userId,
        balance: 1 + Math.random() * 10000,
      });

      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
      res.status(201).json({
        message: "User Registered Successfully",
        token: token,
        name: firstName,
        isAuthenticated: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error registering user", details: err });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Wrong Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      message: "Sign In Successful",
      token: token,
      name: user.firstName,
      isAuthenticated: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while Sign In", details: error });
  }
});

userRouter.get("/logOut", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      message: "Successfully LogOut",
      token: "",
      isAuthenticated: false,
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/changePassword", authMiddleware, async (req, res) => {
  try {
    const validationResult = updateBody.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const updateFields = validationResult.data;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await User.updateOne(
      { _id: userId }, // Filter by user ID
      { $set: updateFields } // Set only the validated fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Information updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error changing password", details: err.message });
  }
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const users = await User.find({
      $or: [
        {
          userName: {
            $regex: filter,
          },
        },
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });

    res.json({
      users: users.map((user) => ({
        _id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error while getting data" });
  }
});

module.exports = userRouter;

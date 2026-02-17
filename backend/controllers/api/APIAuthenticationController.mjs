import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {UserModel} from "../../models/UserModel.mjs";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and generate authentication key
 *     description: |
 *       Authenticates a user using username and password.
 *       On successful login, returns an authentication key to be used for secured APIs.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth_key:
 *                   type: string
 *                   example: a3f9c8b1e7d44e3c9f5b4d2a1c8e6f9a
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 role:
 *                   type: string
 *                   example: admin
 *                 name:
 *                   type: string
 *                   example: John Doe
 *       400:
 *         description: Validation error (missing or invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username and password are required
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid username or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/login", async (req, res) => {
    console.log("API AUTH CONTROLLER LOADED");

  try {
    const { username, password } = req.body;

    //  Basic validation
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    if (typeof password !== 'string') {
      return res.status(400).json({
        error: "Password must be a string"
      });
    }

    //  Find user by email
    const user = await UserModel.findByUserName(username);
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    console.log("User password:", user.password, "Type:", typeof user.password);
    console.log("Input password:", password, "Type:", typeof password);

    //  Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    //  Generate authentication key
    const authKey = crypto.randomBytes(32).toString("hex");
    const key = authKey
    .toString()
    .trim();

    //  Store auth key in DB
    console.log(user)
    await UserModel.updateAuthKey(user.userId, key);

    // Return JSON response
    return res.status(200).json({
      auth_key: key,
      userId:user.userId,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    console.error("API Login Error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Creates a new user account.
 *       Password is securely hashed before storing.
 *       Username must be unique.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password@123
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *                 example: member
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 userId:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Validation error or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All required fields must be provided
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username already exists
 *       500:
 *         description: Internal server error
 */

router.post("/register", async (req, res) => {
  try {
    const { username, password,role,first_name,last_name,phone } = req.body;
    console.log("Register request body:", req.body);

    //  Validation
    if (!username || !password  || !role || !first_name || !last_name || !phone) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        error: "Password must be a string"
      });
    }

    //Check existing user
    const existingUser = await UserModel.findByUserName(username);
    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      role,
      firstName: first_name,
      lastName: last_name,
      phone
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Logout user
 *     description: |
 *       Logs out the authenticated user by invalidating the auth_key.
 *       Provide the auth_key received from /login in the Authorize button
 *       or in the header as 'auth_key'.
 *     tags:
 *       - Authentication
 *     security:
 *       - ApiKeyAuth: []   # uses the global apiKey security
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired auth token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */


router.delete("/logout", async (req, res) => {
  try {
    const authKey = req.headers["auth_key"]; //  change here
    console.log("Logout request with auth_key:", authKey);

    if (!authKey) {
      return res.status(401).json({
        error: "Authorization token required"
      });
    }

    const result = await UserModel.clearAuthKey(authKey);
    console.log("Clear auth key result:", result);

    if (!result) {
      return res.status(401).json({
        error: "Invalid or expired auth key"
      });
    }

    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});



export default router;

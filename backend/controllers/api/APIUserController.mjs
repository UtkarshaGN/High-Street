import express from "express";
import {UserModel} from "../../models/UserModel.mjs";
import  apiAuth  from "../../middleware/apiauth.middleware.mjs";
import crypto from "crypto";
import bcrypt from "bcrypt";

const router = express.Router();
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     description: |
 *       Returns the profile details of the currently authenticated user.
 *
 *       Requires authentication using `auth_key`.
 *     tags:
 *       - Users
 *     security:
 *       - ApiKeyAuth: []   # uses global auth_key security
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 12
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 role:
 *                   type: string
 *                   example: member
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 phone:
 *                   type: string
 *                   example: "9876543210"
 *       401:
 *         description: Unauthorized – missing or invalid auth_key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Failed to load user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to load user profile
 */


router.get("/profile", apiAuth, async (req, res) => {
  res.json({
    userId: req.apiUser.userId,
    firstName: req.apiUser.firstName,
    lastName: req.apiUser.lastName,
    role: req.apiUser.role,
    username: req.apiUser.username,
    phone: req.apiUser.phone,
  });
});

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user's profile
 *     description: |
 *       Updates the profile details of the currently authenticated user.
 *       The user is identified using the authentication key provided in the request header.
 *       Only the fields provided in the request body will be updated.
 *       Role and username are preserved and cannot be modified via this endpoint.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: auth_key
 *         required: true
 *         description: Authentication key of the logged-in user
 *         schema:
 *           type: string
 *           example: a3f9c8b1e7d44e3c9f5b4d2a1c8e6f9a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 description: Optional new password (will be hashed before saving)
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       401:
 *         description: Missing or invalid authentication key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: missing auth_key
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update profile
 */



router.patch("/me", apiAuth, async (req, res) => {
  const { firstName, lastName, phone, password } = req.body;

  try {
    const updateData = {
      userId: req.apiUser.userId,

      // preserve existing values if not provided
      firstName: firstName ?? req.apiUser.firstName,
      lastName: lastName ?? req.apiUser.lastName,
      phone: phone ?? req.apiUser.phone,

      // required fields
      role: req.apiUser.role,
      username: req.apiUser.username,
    };

    //  only hash & update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await UserModel.update(updateData);

    res.json([{ message: "Profile updated successfully" }]);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


export default router;

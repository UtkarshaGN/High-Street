import {UserModel} from "../models/UserModel.mjs";

export default async function apiAuthMiddleware(req, res, next) {
  const authKey = req.headers["auth_key"];

  if (!authKey) {
    return res.status(401).json({ error: "Missing auth_key" });
  }

  try {
    const user = await UserModel.findByAuthKey(authKey);
    console.log("Authenticated user:", user);

    if (!user) {
      return res.status(403).json({ error: "Invalid auth_key" });
    }

    req.apiUser = user; // attach user to request
    next();
  } catch (err) {
    return res.status(500).json({ error: "Authentication failed" });
  }
}

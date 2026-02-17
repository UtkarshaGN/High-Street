import express from "express";
import  apiAuth  from "../../middleware/apiauth.middleware.mjs";
import {SessionModel} from "../../models/SessionModel.mjs";
import {AuthorizationMiddleware} from "../../middleware/apiAutorization.middleware.mjs";

export default class APISessionController {

static routes = express.Router();

static {
  this.routes.get("/", this.getSessions);
  this.routes.post("/", apiAuth, AuthorizationMiddleware.restrict(["trainer"]), this.createSession);
  this.routes.delete("/:id", apiAuth, AuthorizationMiddleware.restrict(["trainer"]), this.deleteSession);
}

/**
 * @openapi
 * tags:
 *   - name: Sessions
 *     description: Gym session scheduling and timetable
 */

/**
 * @openapi
 * /api/sessions:
 *   get:
 *     summary: Get all sessions (weekly timetable)
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sessions
 */
// router.get("/", async (req, res) => {
  static async getSessions(req, res) {
  const { startDate, endDate, trainerId } = req.query;
  var sessions;
  console.log("get sessions with filters", { startDate, endDate, trainerId });
  try {
      sessions = await SessionModel.getAllWithFilters({
        startDate,
        endDate,
        trainerId,
      });
    // }

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to load sessions" });
  }
};




/**
 * @openapi
 * /api/sessions:
 *   post:
 *     summary: Create a new session (admin/trainer)
 *     tags:
 *       - Sessions
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity_id
 *               - location_id
 *               - session_date
 *               - start_time
 *               - end_time
 *               - trainer_id
 *             properties:
 *               activity_id:
 *                 type: string
 *               location_id:
 *                 type: string
 *               session_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-01"
 *
 *               start_time:
 *                 type: string
 *                 description: Start time in HH:mm:ss format
 *                 example: "15:00:00"
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *
 *               end_time:
 *                 type: string
 *                 description: End time in HH:mm:ss format
 *                 example: "16:00:00"
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *
 *               trainer_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created successfully
 */

// router.post("/", apiAuth, async (req, res) => {
  static async createSession(req, res) {
  //if (![ "trainer"].includes(req.apiUser.role)) {
   // return res.status(403).json({ error: "Access denied" });
  //}

  try {
    await SessionModel.create(req.body);
    res.status(201).json({ message: "Session created" });
    // res.status(201).end();
  } catch {
    res.status(500).json({message:"failed to create session"})
  }
};

/**
 * @openapi
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a session (Admin only)
 *     description: |
 *       Deletes a session by its ID.
 *       This action is restricted to users with the **admin** role.
 *     tags:
 *       - Sessions
 *     security:
 *       - ApiKeyAuth: []   # requires auth_key header
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session to delete
 *         schema:
 *           type: string
 *           example: "12"
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session deleted
 *       403:
 *         description: Access denied (Admins only)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Admins only
 *       401:
 *         description: Unauthorized (missing or invalid auth_key)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Failed to delete session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete session
 */

// router.delete("/:id", apiAuth, async (req, res) => {
  static async deleteSession(req, res) {
  //if (!["trainer"].includes(req.apiUser.role)) {
 //   return res.status(403).json({ error: "Access denied" });
 // }

  try {
    const result = await SessionModel.delete(req.params.id);

    if (result.notFound) {
      return res.status(404).json({
        error: "Session not found"
      });
    }

    if (result.bookingFound) {
      return res.status(403).json({
        error: "Booking found. Session cannot be deleted"
      });
    }

    return res.status(200).json({
      message: "Session deleted successfully"
    });

  } catch (err) {
    console.error("Delete session error:", err);
    return res.status(500).json({
      error: "Failed to delete session"
    });
  }
};


}

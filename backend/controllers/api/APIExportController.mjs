import express from "express";
import apiAuth from "../../middleware/apiauth.middleware.mjs";
import { AuthorizationMiddleware } from "../../middleware/apiAutorization.middleware.mjs";
import { SessionModel } from "../../models/SessionModel.mjs";
import { BookingModel } from "../../models/BookingModel.mjs";

export default class ApiExportController { 

static routes = express.Router();

static {
    this.routes.get("/sessions", apiAuth, AuthorizationMiddleware.restrict(["trainer"]), this.exportSessions);
    this.routes.get("/bookings", apiAuth, AuthorizationMiddleware.restrict(["member"]), this.exportBookings);
}


/**
 * @swagger
 * tags:
 *   name: Export
 *   description: XML export APIs
 */

/**
 * @swagger
 * /api/xml/sessions:
 *   get:
 *     summary: Export all sessions as XML
 *     description: |
 *       Returns a list of all sessions in **XML format**.
 *       Access is restricted to users with **admin** or **staff** roles.
 *     tags:
 *       - Sessions
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Sessions exported successfully in XML format
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               example: |
 *                 <?xml version="1.0" encoding="UTF-8"?>
 *                 <sessions>
 *                   <session>
 *                     <id>1</id>
 *                     <trainer>John Doe</trainer>
 *                     <date>2026-01-15</date>
 *                     <time>10:00 AM</time>
 *                     <capacity>20</capacity>
 *                   </session>
 *                 </sessions>
 *       403:
 *         description: Access denied (admin or staff only)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: XML export failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: XML export failed
 */

// router.get("/sessions", apiAuth, async (req, res) => {
  static async exportSessions(req, res) {

  try {
    const sessions = await SessionModel.getAll();

    res.set("Content-Type", "application/xml");
    //res.set("Content-Disposition", "attachment; filename=sessions.xml");

    res.render("xml/sessions", {
      sessions,
      exportDate: new Date().toISOString().split("T")[0]
    });

    // const xml = generateSessionsXML(sessions);

    // res.setHeader("Content-Type", "application/xml");
    // res.send(xml);
  } catch (error) {
    console.error("Session XML Export Error:", error);
    res.status(500).json({ error: "XML export failed" });
  }
};

/**
 * @swagger
 * /api/xml/bookings:
 *   get:
 *     summary: Export all bookings as XML
 *     description: |
 *       Returns a list of all bookings in **XML format**.
 *       Access is restricted to users with **admin** or **staff** roles.
 *     tags:
 *       - Bookings
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Bookings exported successfully in XML format
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               example: |
 *                 <?xml version="1.0" encoding="UTF-8"?>
 *                 <bookings>
 *                   <booking>
 *                     <id>101</id>
 *                     <member>Jane Smith</member>
 *                     <sessionId>25</sessionId>
 *                     <status>booked</status>
 *                   </booking>
 *                 </bookings>
 *       403:
 *         description: Access denied (admin or staff only)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: XML export failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: XML export failed
 */

// router.get("/bookings", apiAuth, async (req, res) => {
  static async exportBookings(req, res) {

  try {
    const bookings = await BookingModel.getAll();

    res.set("Content-Type", "application/xml");
    //res.set("Content-Disposition", "attachment; filename=bookings.xml");

    res.render("xml/bookings", {
      bookings,
      exportDate: new Date().toISOString().split("T")[0]
    });
  } catch (err) {
    console.error("XML export failed:", err);
    res.status(500).json({ error: "XML export failed" });
  }
};


}

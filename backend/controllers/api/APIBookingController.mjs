import express from "express";
import apiAuth  from "../../middleware/apiauth.middleware.mjs";
import {AuthorizationMiddleware} from "../../middleware/apiAutorization.middleware.mjs";
import {BookingModel} from "../../models/BookingModel.mjs";

export class APIBookingController {
  static routes = express.Router();

  static { 
    this.routes.get("/", apiAuth, AuthorizationMiddleware.restrict(["member"]), this.getBookings);
    this.routes.post("/", apiAuth, AuthorizationMiddleware.restrict(["member"]), this.createBooking);
    this.routes.delete("/:id", apiAuth, AuthorizationMiddleware.restrict(["member"]), this.cancelBooking);
  }



/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings
 *     description: |
 *       Returns bookings based on the authenticated user's role.
 *
 *       - **Admin**: Receives all bookings
 *       - **Member**: Receives only their own bookings
 *
 *       This endpoint requires authentication using `auth_key`.
 *     tags:
 *       - Bookings
 *     security:
 *       - ApiKeyAuth: []   # uses global auth_key security
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: integer
 *                     example: 101
 *                   user_id:
 *                     type: integer
 *                     example: 12
 *                   slot_id:
 *                     type: integer
 *                     example: 5
 *                   booking_date:
 *                     type: string
 *                     format: date
 *                     example: 2026-01-25
 *                   status:
 *                     type: string
 *                     example: confirmed
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
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied
 *       500:
 *         description: Failed to load bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to load bookings
 */

// router.get("/", apiAuth, async (req, res) => {
  static async getBookings(req, res) {
  try {

    const { date,status,session } = req.query;
    if(date || status || session){
      const bookings = await BookingModel.getAllWithFilters({
        date,
        status,
        session
      });
      return res.json(bookings);
    }

    console.log("bookings")
    const bookings = await BookingModel.getByMember(req.apiUser.userId);
    const formatted = bookings.map(b => ({
  ...b,
  status: String(b.status),
}));

res.json(formatted);
    // res.json(bookings);
  } catch {
    res.status(500).json({ error: "Failed to load bookings" });
  }
};


/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a session
 *     description: |
 *       Creates a new booking for the authenticated user.
 *
 *       - **Access**: Members only
 *       - **Admins** are not allowed to book sessions
 *       - Requires authentication using `auth_key`
 *     tags:
 *       - Bookings
 *     security:
 *       - ApiKeyAuth: []   # uses global auth_key security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Session booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session booked successfully
 *       403:
 *         description: Forbidden – members only
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Members only
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
 *         description: Failed to create booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create booking
 */

// router.post("/", apiAuth, async (req, res) => {
  static async createBooking(req, res) {

  const { sessionId } = req.body;

  try {
    await BookingModel.create({
      sessionId,
      userId: req.apiUser.userId,
      status: "booked"
    });

    res.status(201).json({ message: "Session booked successfully" });
  } catch (error) {
    console.error("Booking error:", error);
    
    // Handle duplicate booking (unique constraint violation)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(404).json({ error: "User is already booked for this session" });
    }
    
    // Handle other specific errors if needed
    if (error.message && error.message.includes("already booked")) {
      return res.status(404).json({ error: error.message });
    }
    
    // Generic error
    res.status(500).json({ error: "Failed to create booking" });
  }
};

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     description: |
 *       Cancels a booking by its ID.
 *
 *       **Authorization rules:**
 *       - **Admin**: Can cancel any booking
 *       - **Member**: Can cancel only their own bookings
 *
 *       Requires authentication using `auth_key`.
 *     tags:
 *       - Bookings
 *     security:
 *       - ApiKeyAuth: []   # uses global auth_key security
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID to cancel
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking cancelled
 *       403:
 *         description: Forbidden – access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied
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
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Failed to cancel booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to cancel booking
 */

// router.delete("/:id", apiAuth, async (req, res) => {
  static async cancelBooking(req, res) {
  try {
    const booking = await BookingModel.getById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    await BookingModel.delete(req.params.id);

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    if (err === "not found") {
      return res.status(404).json({ error: "Booking not found" });
    }

    console.error(err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

}

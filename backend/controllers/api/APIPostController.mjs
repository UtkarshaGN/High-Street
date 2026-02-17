import express from "express";
import { PostUserModel } from "../../models/PostUserModel.mjs";
import apiAuth from "../../middleware/apiauth.middleware.mjs";
import { PostModel } from "../../models/PostModel.mjs";
import { AuthorizationMiddleware } from "../../middleware/apiAutorization.middleware.mjs";

export class APIPostController {
  static routes = express.Router();

  static {
    this.routes.get("/", this.getPosts);
    this.routes.get("/me",apiAuth, this.getPostById);
    this.routes.post("/", apiAuth, AuthorizationMiddleware.restrict(["member","trainer"]), this.createPost);
    this.routes.delete("/:id", apiAuth, AuthorizationMiddleware.restrict(["member","trainer"]), this.deletePost);
  }

 /**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a post for the authenticated user
 *     tags:
 *       - Posts
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first post
 *               content:
 *                 type: string
 *                 example: This is the content of my post
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post created successfully
 *                 post:
 *                   type: object
 *                   properties:
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 12
 *                     title:
 *                       type: string
 *                       example: My first post
 *                     content:
 *                       type: string
 *                       example: This is the content of my post
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-31T10:15:30.000Z
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Failed to create post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create post
 */


  static async createPost(req, res) {
    try {
      const postData = {
        userId: req.apiUser.userId,
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date(),
      };

      const createdPost = await PostUserModel.create(postData);
      res.status(200).json([{
        message: "Post created successfully",
        post: createdPost, // return the full created post with user details
      }]);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to create post",
        error: error,
      });
    }
  }

  /**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postId:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Hello World"
 *                   content:
 *                     type: string
 *                     example: "This is the post content"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-29T12:00:00Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to load posts from database"

*/

  static async getPosts(req, res) {
    try {
      // console.log("Fetching all posts");
      const posts = await PostUserModel.getAll();
      console.log("Posts fetched:", posts);
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to load posts from database",
      });
    }
  }

  /**
 * @swagger
 * /api/posts/me:
 *   get:
 *     summary: Get post for the authenticated user
 *     description: Fetches the post associated with the currently authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: integer
 *                   example: 6
 *                 userId:
 *                   type: integer
 *                   example: 12
 *                 title:
 *                   type: string
 *                   example: My First Post
 *                 content:
 *                   type: string
 *                   example: This is the post content
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to load posts from database
 */


  static async getPostById(req, res) {
    try {
      const userId = req.apiUser.userId;
      const post = await PostUserModel.getByUserId(userId);
      console.log("Post fetched for userId", userId, ":", post);
      res.status(200).json({post});

    } catch (error) {
      // TODO: Handle not found
      if (error == "not found") {
        res.status(404).json({
          message: "Post not found",
        });
      } else {
        console.error(error);
        res.status(500).json({
          message: "Failed to load posts from database",
        });
      }
    }
  }

  /**
   * @swagger
   * /api/posts/{id}:
   *   delete:
   *     summary: Delete a post by ID
   *     tags: [Posts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 5
   *     responses:
   *       200:
   *         description: Post deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Post deleted
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/Error'
   */

  static async deletePost(req, res) {
  try {
    const result = await PostModel.delete(req.params.id);

    if (result && result.affectedRows == 1) {
      // Just send status 204 (No Content), no body
     return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
    

    } else {
      res.status(404).json({message:"Post not Found"}); // Post not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message:error.message || "Internal server error"}); // Internal server error
  }
}

}

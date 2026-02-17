import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import { apiRequest } from "../services/api.jsx";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Microblog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest("/posts/me", { method: "GET" });
      if (!data) setBlogs([]);
      else setBlogs(Array.isArray(data.post) ? data.post : [data]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blogs.",err);
      setError("Failed to load blogs.");
      setBlogs([]); // Clear blogs on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch all blogs
  useEffect(() => {
    fetch();
  }, []);

  // Create a new post
  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to create a post.");
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    try {
      setPosting(true);

       await apiRequest("/posts", {
        method: "POST",
        body: { title, content },
      });

      setTitle("");
      setContent("");
      toast.success("Post created successfully!");

      await fetch(); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post.", err);
    } finally {
      setPosting(false);
    }
  };

  // Delete a blog
  const handleDelete = async (postId) => {
  if (!isAuthenticated) {
    toast.error("You must be logged in to delete a post.");
    navigate("/login");
    return;
  }

  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-medium">Delete this blog?</p>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 text-sm bg-gray-200 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
          onClick={async () => {
            toast.dismiss(t.id);

            try {
              await apiRequest(`/posts/${postId}`, { method: "DELETE" });

              toast.success("Blog deleted successfully!");

              fetch();

              // Optional: remove from UI state here
            } catch (err) {
              console.error(err);
              toast.error("Failed to delete blog.");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), { duration: 5000 });
};


  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-8">Community Blogs</h2>

      {/*  Create Post */}
      <Card className="mb-10 p-4">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border border-gray-700 rounded-lg p-3 mb-3 bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="4"
          placeholder="Write your thoughts..."
          className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-transparent resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={posting}
            className="bg-accent text-black px-6 py-2 rounded-full disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </Card>

      {/*  Blog Feed */}
      {loading ? (
        <p className="text-center text-gray-400">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs available.</p>
      ) : (
        <div className="space-y-6">
          {blogs &&
            blogs.map(({ post, user: postUser }) => (
              <Card key={post?.postId} className="relative p-4">
                {/* User Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-bold">
                      {(postUser?.firstName ||
                        postUser?.username ||
                        "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {postUser?.firstName ||
                          postUser?.username ||
                          "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(post?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(post?.postId)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Delete blog"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Post Content */}
                <h4 className="text-lg font-bold mb-2">{post?.title}</h4>
                <p className="text-gray-300 whitespace-pre-line">
                  {post?.content}
                </p>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

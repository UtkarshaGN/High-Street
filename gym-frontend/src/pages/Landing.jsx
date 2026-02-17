import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.jsx";
import { FaTrash } from "react-icons/fa";
import Card from "../components/ui/Card.jsx";

export default function Landing() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await apiRequest("/posts", {
          method: "GET",
        });
        setBlogs(res || []);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        className="h-[280px] bg-cover bg-center relative flex items-end p-6"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48)",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-white">
            Build Strength
            <br />
            <span className="text-accent">Build Confidence</span>
          </h1>

          <p className="text-sm text-gray-300 mt-2">
            Train anytime. Anywhere.
          </p>

          <a
            href="/register"
            className="inline-block mt-4 bg-accent text-black px-6 py-3 rounded-full font-bold text-sm"
          >
            Join Now
          </a>
        </div>
      </section>

      {/* BLOGS */}
      <section className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Latest <span className="text-accent">Blogs</span>
        </h2>

        {loading && (
          <p className="text-gray-400 text-sm">Loading blogs...</p>
        )}

        {!loading && blogs.length === 0 && (
          <p className="text-gray-400 text-sm">No blogs found.</p>
        )}

        <div className="space-y-6">
          {blogs.map(({ post, user: postUser }) => (
            <Card key={post.postId} className="relative p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-bold">
                  {(postUser?.firstName ||
                    postUser?.username ||
                    "A")[0]}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">
                    {postUser?.firstName ||
                      postUser?.username ||
                      "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2">
                {post.title}
              </h3>

              <p className="text-sm text-gray-300 line-clamp-3">
                {post.content}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="p-6">
        <div className="bg-accent rounded-2xl p-6 text-black text-center">
          <h2 className="text-lg font-extrabold">
            Ready to Transform?
          </h2>

          <a
            href="/register"
            className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-full font-bold text-sm"
          >
            Get Started
          </a>
        </div>
      </section>
    </>
  );
}

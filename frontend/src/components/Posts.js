import React, { useEffect, useState } from "react";
import { useWallet } from "./WalletContext";

const Posts = () => {
  const { contract } = useWallet();
  const [posts, setPosts] = useState([]);
  const [showFlagged, setShowFlagged] = useState(false);

  const fetchAllPosts = async () => {
    if (!contract) return;
  
    try {
      const postsFromContract = await contract.getAllPosts();
  
      const parsed = postsFromContract.map((post) => ({
        id: Number(post.id),
        author: post.author,
        timestamp: Number(post.timestamp),
        imageURL: `https://gateway.pinata.cloud/ipfs/${post.hash}`,
        likes: Number(post.likes),
        dislikes: Number(post.dislikes),
        isFlagged: post.isFlagged,
        status: Number(post.status),
        isOriginal: post.isOriginal, // ✅ New field handled here
      }));
  
      setPosts(parsed);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert("❌ Failed to fetch posts from the smart contract.");
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [contract]);

  const handleLike = async (postId) => {
    if (!contract) return;
    try {
      const tx = await contract.LikePost(postId);
      await tx.wait();
      alert("👍 Liked the post!");
      fetchAllPosts();
    } catch (err) {
      console.error("Failed to like post:", err);
      alert("❌ Failed to like the post.");
    }
  };

  const handleDislike = async (postId) => {
    if (!contract) return;
    try {
      const tx = await contract.DislikePost(postId);
      await tx.wait();
      alert("👎 Disliked the post!");
      fetchAllPosts();
    } catch (err) {
      console.error("Failed to dislike post:", err);
      alert("❌ Failed to dislike the post.");
    }
  };

  const handleReport = async (postId) => {
    if (!contract) return;
    try {
      const tx = await contract.report(postId);
      await tx.wait();
      alert("🚨 Reported successfully!");
      fetchAllPosts();
    } catch (err) {
      console.error("Report failed:", err);
      alert("❌ Failed to report. Maybe you already reported this post?");
    }
  };

  const voteOnPost = async (postId, isMisinformation) => {
    if (!contract) return;
    try {
      const tx = await contract.vote(postId, isMisinformation);
      await tx.wait();
      alert(`✅ Your vote for post ${postId} has been recorded.`);
      fetchAllPosts();
    } catch (err) {
      console.error("Voting failed:", err);
      alert("❌ Voting failed.");
    }
  };

  const getStatusText = (status) => {
    const stat = Number(status);
    switch (stat) {
      case 0:
        return "Normal";
      case 1:
        return "Verified";
      case 2:
        return "Misinformation";
      default:
        return "Unknown";
    }
  };

  const filteredPosts = posts.filter((post) =>
    showFlagged ? post.isFlagged : !post.isFlagged
  );

  return (
    <div className="flex flex-col items-center">
      {/* Toggle & Refresh Buttons */}
      <div className="flex justify-center gap-4 mt-6 mb-4">
        <button
          onClick={() => setShowFlagged((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showFlagged ? "🔍 Show Unflagged Posts" : "🚩 Show Flagged Posts"}
        </button>
        <button
          onClick={fetchAllPosts}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <p className="text-center mt-10">📭 No posts found</p>
      ) : (
        <div className="flex flex-col gap-6 px-4 pb-4 max-h-[80vh] overflow-y-auto items-center w-full">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="w-[600px] bg-white rounded-2xl shadow-lg p-4"
            >
              <div className="w-full h-70 overflow-hidden rounded-md mb-4">
                <img
                  src={post.imageURL}
                  alt={`Post by ${post.author}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">👤 {post.author}</p>
              <p className="text-sm text-gray-500 mb-2">
                🕒 {new Date(post.timestamp * 1000).toLocaleString()}
              </p>
              <p className="text-sm">👍 {post.likes} | 👎 {post.dislikes}</p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  post.status === 1
                    ? "text-green-600"
                    : post.status === 2
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                <p className="text-pink-500">

                {post.isOriginal? "Original": ""}
                </p>
                {getStatusText(post.status)}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {/* Only show Report if not flagged */}
                {!post.isFlagged && (
                  <button
                    onClick={() => handleReport(post.id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                  >
                    🚨 Report
                  </button>
                )}
                <button
                  onClick={() => handleLike(post.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  👍 Like
                </button>
                <button
                  onClick={() => handleDislike(post.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  👎 Dislike
                </button>
              </div>

              {/* Vote Buttons if flagged */}
              {post.isFlagged && (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => voteOnPost(post.id, true)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    ✅ Yes (Misinformation)
                  </button>
                  <button
                    onClick={() => voteOnPost(post.id, false)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    ❌ No (Not Misinformation)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

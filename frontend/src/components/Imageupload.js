import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWallet } from "./WalletContext";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [hashExists, setHashExists] = useState(null); // true / false / null
  const [existingStatus, setExistingStatus] = useState(0); // enum from smart contract
  const [isOriginal, setIsOriginal] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { account, contract, connectWallet } = useWallet();

  // 🔄 Auto-connect wallet on reload if not connected
  useEffect(() => {
    if (!account) {
      connectWallet();
    }
  }, [account, connectWallet]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setHashExists(null);
    setIpfsHash("");
    setShowForm(false);
  };

  const handleUploadAndVerify = async () => {
    if (!file || !contract)
      return alert("Please select file and connect wallet.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const jwt = process.env.REACT_APP_PINATA_JWT;
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: jwt,
          },
        }
      );

      const hash = res.data.IpfsHash;
      setIpfsHash(hash);

      const verifyRes = await contract.verify(hash);
      const _hashExists = verifyRes[0];
      const _existingStatus = verifyRes[1];

      setHashExists(_hashExists);
      setExistingStatus(_existingStatus);

      if (!_hashExists) setShowForm(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error verifying hash.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!ipfsHash || !contract) return;
    try{

      const tx = await contract.createPost(
        ipfsHash,
        hashExists,
        isOriginal,
        existingStatus
      );
      await tx.wait();
      alert("✅ Post created on blockchain!");
      resetForm();
    }catch (err) {
      if (err.message.includes("user denied transaction signature")) {
        alert("❌ Transaction rejected by the user.");
      } else {
        console.error("Posting failed:", err);
        alert("❌ Failed to create Post. ");
      }
    }
  };

  const resetForm = () => {
    setFile(null);
    setHashExists(null);
    setIpfsHash("");
    setShowForm(false);
    setIsOriginal(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">🖼️ Upload and Post Image</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <br />
      <button
        onClick={handleUploadAndVerify}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Verifying..." : "Upload & Verify"}
      </button>

      {hashExists === true && (
        <div className="mt-4">
          <p className="text-green-700 font-semibold mb-2">
            ✅ Hash already exists. You can still create a post.
          </p>
          <button
            onClick={handleCreatePost}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Create Post
          </button>
        </div>
      )}

      {showForm && hashExists === false && (
        <div className="mt-6">
          <p className="font-semibold mb-2">🧠 Is this image original or referenced?</p>
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setIsOriginal(true)}
              className={`py-2 px-4 rounded ${
                isOriginal ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setIsOriginal(false)}
              className={`py-2 px-4 rounded ${
                !isOriginal ? "bg-red-600 text-white" : "bg-gray-200"
              }`}
            >
              Referenced
            </button>
          </div>
          <button
            onClick={handleCreatePost}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Post
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./WalletContext";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const { connectWallet } = useWallet();

    const registerUser = async () => {
        try {
            const connection = await connectWallet();
            if (!connection) return;

            const { contractInstance, userAddress } = connection;

            const tx = await contractInstance.register(username);
            await tx.wait();

            const userDetails = await contractInstance.getUser(userAddress);

            const userInfo = {
                address: userDetails[0],
                username: userDetails[1],
                postCount: Number(userDetails[2]),
                reputation: Number(userDetails[3]),
                isVerified: userDetails[4],
            };

            // ✅ Store in localStorage
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            alert("✅ Registered!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error object:", err);

            let reason = err?.info?.error?.message || err?.error?.message || err?.message || "";

            if (reason.includes("User is already registered")) {
                alert("⚠️ This wallet is already registered.");
            } else {
                alert("❌ Registration failed. Check console.");
            }
        }
    };

    const loginUser = async () => {
        try {
            const connection = await connectWallet();
            if (!connection) return;

            const { contractInstance, userAddress } = connection;

            const userDetails = await contractInstance.getUser(userAddress);

            const tx = await contractInstance.login();
            await tx.wait();

            const userInfo = {
                address: userDetails[0],
                username: userDetails[1],
                postCount: Number(userDetails[2]),
                reputation: Number(userDetails[3]),
                isVerified: userDetails[4],
            };

            // ✅ Store in localStorage
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            alert("✅ Logged in!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            const message =
                err?.reason || err?.error?.message || err?.data?.message || err?.message || "Unknown error";
            alert("❌ Login failed: " + message);
        }
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen">

        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Decentralized-X</h3>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">👤 Register</h3>

            <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />

            <button
                onClick={registerUser}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                Register
            </button>

            <hr className="my-6 border-t" />

            <button
                onClick={loginUser}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                Login to dApp
            </button>
        </div>
                </div>
    );
}

export default Register;

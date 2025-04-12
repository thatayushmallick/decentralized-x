import React, { useEffect, useState } from "react";
import Imageupload from "./Imageupload";
import Posts from "./Posts";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-16 text-lg font-semibold text-gray-700">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6 shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            🎉 Welcome {user.username}
            {user.isVerified && (
              <span className="ml-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                ✅ Verified
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-600 break-all mb-4">
            Wallet: {user.address}
          </p>

          <Imageupload />
        </div>
      </div>

      {/* Scrollable Post Viewer */}
      <div className="w-3/4 h-screen overflow-y-scroll snap-y snap-mandatory bg-white">
        <Posts />
      </div>
    </div>
  );
}

export default Dashboard;

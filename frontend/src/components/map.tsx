import { useState, useEffect } from "react";
import { useRoom } from "../context/RoomContext";

function Map() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [copied, setCopied] = useState(false);
  const { roomId } = useRoom();

  const roomUrl = `${window.location.origin}/?roomId=${roomId}`;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-linear-to-r from-green-600 to-yellow-600 p-2 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-2">
          <div className="flex items-center w-full md:w-auto">
            {windowWidth < 768 && !isSidebarOpen && (
              <button
                className="mr-3 bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/20 transition"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <span className="font-semibold tracking-wide">Room:</span>
            <span className="ml-2 px-2 py-1 bg-white text-green-700 rounded-md font-mono text-sm shadow-inner">
              {roomId}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
            <div className="flex flex-1 items-center bg-white rounded-md overflow-hidden shadow-sm">
              <input
                type="text"
                value={roomUrl}
                readOnly
                className="flex-1 px-3 py-2 text-xs md:text-sm text-gray-700 bg-transparent outline-none truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className={`${
                  copied ? "bg-green-700" : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 text-sm font-medium transition-colors`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* This is where your Leaflet Map component goes */}
        <div className="h-full w-full bg-slate-200">
          {/* Map Component Here */}
        </div>
      </div>
    </div>
  );
}

export default Map;

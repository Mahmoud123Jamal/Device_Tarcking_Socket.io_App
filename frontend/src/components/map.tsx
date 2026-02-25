import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRoom } from "../context/RoomContext";
import Sidebar from "./SideBar";
import socket, {
  joinRoom,
  listenforLocationUpdate,
  sendLocationUpdate,
} from "../socket";
import MapContent from "./MapContent";

function Map() {
  const {
    roomId,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    route,
    setRoute,
    loadingRoute,
    setLoadingRoute,
    usersWithMe,
  } = useRoom();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [copied, setCopied] = useState(false);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);

  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const roomUrl = `${window.location.origin}/room/${roomId}`;
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://where-to-dliver-app.onrender.com";

  useEffect(() => {
    if (!roomId || !isTrackingEnabled) return;

    joinRoom(roomId);
    listenforLocationUpdate((updatedUsers) => setUsers(updatedUsers));

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        sendLocationUpdate({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === 1) alert("Please enable location permissions.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("locationUpdate");
    };
  }, [roomId, setUsers, isTrackingEnabled]);

  useEffect(() => {
    const me = users.find((u) => u.userId === socket.id);
    if (!selectedUser || !me) {
      setRoute(null);
      return;
    }

    const sLat = me.latitude || (me as any).lat;
    const sLng = me.longitude || (me as any).lng;
    const eLat = selectedUser.latitude || (selectedUser as any).lat;
    const eLng = selectedUser.longitude || (selectedUser as any).lng;

    if (!sLat || !sLng || !eLat || !eLng) return;

    if (lastCoordsRef.current) {
      const diff =
        Math.abs(lastCoordsRef.current.lat - sLat) +
        Math.abs(lastCoordsRef.current.lng - sLng);
      if (diff < 0.0001) return;
    }

    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setLoadingRoute(true);
      try {
        const [routeRes, distRes] = await Promise.all([
          axios.post(
            `${API_BASE_URL}/api/route`,
            {
              start: { lat: sLat, lng: sLng },
              end: { lat: eLat, lng: eLng },
            },
            { cancelToken: source.token },
          ),
          axios.post(
            `${API_BASE_URL}/api/calculate-distance`,
            {
              origin: { location: { latitude: sLat, longitude: sLng } },
              dest: { location: { latitude: eLat, longitude: eLng } },
            },
            { cancelToken: source.token },
          ),
        ]);

        if (routeRes.data) {
          setRoute(routeRes.data);
        }

        if (distRes.data) {
          setSelectedUser((prev) =>
            prev ? { ...prev, ...distRes.data } : null,
          );
        }

        lastCoordsRef.current = { lat: sLat, lng: sLng };
      } catch (err: any) {
        if (!axios.isCancel(err)) console.error("API Error:", err.message);
      } finally {
        setLoadingRoute(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 1000);
    return () => {
      clearTimeout(timeoutId);
      source.cancel("Request cancelled by cleanup");
    };
  }, [
    selectedUser?.userId,
    users,
    API_BASE_URL,
    setRoute,
    setLoadingRoute,
    setSelectedUser,
  ]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="sticky top-0 z-30 bg-linear-to-r from-green-600 to-yellow-600 p-2 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2 max-w-7xl mx-auto">
          <div className="flex items-center justify-between w-full md:w-auto gap-2">
            <div className="flex items-center min-w-0">
              {windowWidth < 768 && !isSidebarOpen && (
                <button
                  className="mr-2 bg-white/20 p-2 rounded-full hover:bg-white/30"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <svg
                    className="h-5 w-5"
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
              <span className="font-semibold text-sm mr-2 shrink-0">Room:</span>
              <span className="px-2 py-1 bg-white text-green-700 rounded-md font-mono text-xs truncate shadow-inner">
                {roomId || "..."}
              </span>
            </div>
          </div>

          <div className="flex items-center w-full md:w-auto max-w-full">
            <div className="flex w-full items-center bg-white rounded-lg overflow-hidden shadow-sm">
              <input
                type="text"
                value={roomUrl}
                readOnly
                className="flex-1 px-3 py-2 text-[10px] md:text-xs text-gray-600 outline-none truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className={`${copied ? "bg-green-700" : "bg-green-500"} text-white px-4 py-2 text-xs font-bold transition-colors shrink-0`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        {!isTrackingEnabled && (
          <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-2">Live Tracking</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Join the room to share your location and see ETA.
              </p>
              <button
                onClick={() => setIsTrackingEnabled(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Start Sharing
              </button>
            </div>
          </div>
        )}

        <Sidebar
          users={users}
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?.userId || null}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          windowWidth={windowWidth}
        />

        <div className="flex-1 relative z-0">
          <MapContent
            users={usersWithMe}
            mySocketId={socket.id || ""}
            route={route}
            selectedUser={selectedUser}
            selectedUserId={selectedUser?.userId}
          />
          {loadingRoute && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600"></div>
              <p className="mt-2 text-green-900 font-bold bg-white/90 px-4 py-1 rounded-full shadow-lg text-sm">
                Calculating...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Map;

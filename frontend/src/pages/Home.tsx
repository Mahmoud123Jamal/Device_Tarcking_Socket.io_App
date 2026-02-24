import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Hero from "../components/hero";
import { useRoom } from "../context/RoomContext";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const { roomId, setRoomId } = useRoom();
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams();
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get("roomId") || pathId;

    if (idFromUrl && idFromUrl !== roomId) {
      setRoomId(idFromUrl);
    }
  }, [searchParams, pathId, roomId, setRoomId]);

  if (roomId) {
    return <Hero />;
  }

  const handleCreateRoom = () => {
    const newId = uuidv4().slice(0, 8);
    setRoomId(newId);
    navigate(`/room/${newId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = inputVal.trim();
    if (trimmedId) {
      setRoomId(trimmedId);
      navigate(`/room/${trimmedId}`);
    }
  };

  return (
    <div className="min-h-screen bg-sky-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounce text-7xl mb-4">📍</div>
      <h1 className="text-5xl font-black italic mb-2 tracking-tighter">
        WhereAmI
      </h1>
      <p className="text-sky-200 mb-8 max-w-sm">
        Share your live location with friends in secure private rooms.
      </p>

      {!isJoining ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button
            onClick={handleCreateRoom}
            className="bg-white text-sky-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-sky-100 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Create New Room
          </button>
          <button
            onClick={() => setIsJoining(true)}
            className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-sky-400 active:scale-95 cursor-pointer"
          >
            Join Existing Room
          </button>
        </div>
      ) : (
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300">
          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Paste Room ID here..."
              value={inputVal}
              autoFocus
              onChange={(e) => setInputVal(e.target.value)}
              className="px-6 py-4 rounded-2xl text-sky-900 font-semibold outline-none focus:ring-4 ring-sky-400 bg-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsJoining(false)}
                className="bg-gray-500/50 hover:bg-gray-500 px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Join Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;

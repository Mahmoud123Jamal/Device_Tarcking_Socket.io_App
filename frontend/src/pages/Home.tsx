import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "../components/hero";
import { useRoom } from "../context/RoomContext";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const { roomId, setRoomId } = useRoom();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const idFromUrl = searchParams.get("roomId");
    if (idFromUrl && !roomId) {
      setRoomId(idFromUrl);
    }
  }, [searchParams, roomId, setRoomId]);

  const handleCreateRoom = () => {
    const newId = uuidv4().slice(0, 8);
    navigate(`/?roomId=${newId}`);
    setRoomId(newId);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      navigate(`/?roomId=${inputVal.trim()}`);
      setRoomId(inputVal.trim());
    }
  };

  if (!roomId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-sky-900 text-white p-4 text-center">
        <div className="animate-bounce text-6xl">📍</div>
        <h1 className="text-4xl font-black italic">WhereAmI</h1>

        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md shadow-xl w-full max-w-md">
          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Room ID..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="px-6 py-3 rounded-full text-sky-900 font-semibold outline-none focus:ring-4 ring-sky-400 bg-white"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              Join Existing Room
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sky-300">
            <div className="h-px bg-sky-300/30 flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-sky-300/30 flex-1"></div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="bg-white text-sky-900 px-8 py-3 rounded-full font-bold hover:bg-sky-100 transition-all w-full"
          >
            Create New Room
          </button>
        </div>
      </div>
    );
  }

  return <Hero />;
}

export default Home;

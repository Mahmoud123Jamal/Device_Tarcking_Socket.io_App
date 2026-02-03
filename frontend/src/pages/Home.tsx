import Hero from "../components/hero";
import { useRoom } from "../context/RoomContext";

function Home() {
  const { roomId } = useRoom();
  if (!roomId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-sky-700 text-white">
        <h1 className="text-4xl font-bold">No Room ID Found</h1>
        <p className="text-lg">Please provide a room ID in the URL.</p>
      </div>
    );
  }
  return (
    <>
      <Hero />
    </>
  );
}

export default Home;

import { useRoom } from "../context/RoomContext";

function InputRoom() {
  const { setRoomInput, roomInput } = useRoom()!;

  const createRoomHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomInput.trim() === "") return;
    window.location.href = `/room/${encodeURIComponent(roomInput.trim())}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">
          Join a Tracking Room
        </h2>

        <form className="space-y-4" onSubmit={createRoomHandler}>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Room ID"
              required
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="w-full px-4 py-3 text-base md:text-lg bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-3 md:py-4 rounded-lg shadow-lg hover:shadow-sky-200 transition-all duration-300 transform active:scale-[0.98] text-sm md:text-base"
          >
            Join Room
          </button>
        </form>

        <p className="mt-4 text-[10px] md:text-xs text-center text-gray-500 leading-relaxed">
          Enter the unique code to start tracking live locations.
        </p>
      </div>
    </div>
  );
}

export default InputRoom;

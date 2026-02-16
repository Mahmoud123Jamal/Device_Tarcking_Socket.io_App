import { Routes, Route } from "react-router-dom";
import { RoomProvider } from "./context/RoomContext";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home";
import Map from "./components/map";

function App() {
  return (
    <RoomProvider>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Map />} />
        </Routes>
      </RootLayout>
    </RoomProvider>
  );
}

export default App;

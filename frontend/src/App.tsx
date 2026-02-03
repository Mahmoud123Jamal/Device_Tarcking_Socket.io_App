import { RoomProvider } from "./context/RoomContext";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <RoomProvider>
        <RootLayout>
          <Home />
        </RootLayout>
      </RoomProvider>
    </>
  );
}

export default App;

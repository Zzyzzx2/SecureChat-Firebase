import { useRef, useState } from "react";
import "./App.css";
import Auth from "./components/Auth.jsx";
import Cookies from "universal-cookie";
import Chat from "./components/Chat.jsx";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth-token");
      setIsAuth(false);
      setRoom(null);
    } catch (error) {
      console.log(error);
    }
  };
  const roomInputRef = useRef(null);
  if (!isAuth) {
    return (
      <>
        <Auth setIsAuth={setIsAuth} />
      </>
    );
  }
  return (
    <>
      {room ? (
        <div>
          <Chat room={room} setRoom={setRoom} />
        </div>
      ) : (
        <div>
          <label className="text-2xl">Enter Room Name:</label>
          <input
            className="rounded-lg m-2 p-2 text-teal-100 bg-neutral-700"
            ref={roomInputRef}
          />
          <button
            className="hover:bg-emerald-700 hover:border-cyan-600 hover:border-2"
            onClick={() => {
              setRoom(roomInputRef.current.value);
            }}
          >
            Enter Room
          </button>
        </div>
      )}{" "}
      <div>
        <button className="mt-2 hover:bg-gray-700" onClick={signUserOut}>
          Logout
        </button>
      </div>
    </>
  );
}

export default App;

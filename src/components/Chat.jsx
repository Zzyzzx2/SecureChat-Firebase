import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Input from "./Input";
import { FaArrowDown } from "react-icons/fa";

const Chat = ({ room, setRoom }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]); // [ {text: "hello", user: "user1"}, {text: "hi", user: "user2"}
  const messagesRef = collection(db, "Messages");
  const [userColor, setUserColor] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const roomInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  useLayoutEffect(() => {
    // Scroll to the bottom of the chat
    if (chatContainerRef.current && shouldAutoScroll) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    const color = getUserColor(auth.currentUser.uid);
    setUserColor(color);

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => {
      unsubscribe();
    };
  }, [room]);
  useEffect(() => {
    // Set focus on the input element when the room changes
    inputRef.current.focus();
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    if (newMessage === "") return;

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        userColor,
      });
      //   console.log(messagesRef);
      //   console.log(newMessage);
      setNewMessage("");
      setShouldAutoScroll(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleScroll = () => {
    // Check if the scrollbar is at the bottom
    const isAtBottom =
      chatContainerRef.current.scrollTop +
        chatContainerRef.current.clientHeight ===
      chatContainerRef.current.scrollHeight;

    // Disable auto-scroll only if the scrollbar is manually moved up
    setShouldAutoScroll(isAtBottom);
  };
  const handleDownButtonClick = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setShouldAutoScroll(true); // Enable auto-scroll after manually scrolling down
    }
  };
  const handleKeyPress = (e) => {
    // Check if the pressed key is Enter (key code 13)
    console.log(e);
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default behavior of the Enter key (e.g., new line in a textarea)
      handleSubmit(e);
    }
  };
  const changeRoom = () => {
    setRoom(roomInputRef.current.value);
  };
  const handleChangeRoom = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      changeRoom();
    }
  };

  const getUserColor = (userId) => {
    const hash = userId
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = `hsl(${hash % 360}, 70%, 70%)`; // Use HSL for a variety of colors
    return color;
  };
  const getComplementaryColor = (userColor) => {
    // Extract hue from user color
    const hueRegex = /hsl\((\d+),/;
    const match = userColor.match(hueRegex);
    const baseHue = match ? parseInt(match[1], 10) : 0;

    // Calculate complementary hue (shift by 180 degrees)
    const complementaryHue = (baseHue + 180) % 360;

    // Use HSL for a variety of colors
    const complementaryColor = `hsl(${complementaryHue}, 20%, 15%)`;
    return complementaryColor;
  };
  return (
    <div className="flex-col ">
      <h1 className="text-emerald-500">SecureWhisper </h1>
      <h2 className="text-teal-300">Welcome to: {room}</h2>
      <div className="relative">
        <form
          onScroll={handleScroll}
          ref={chatContainerRef}
          className="bg-[#312f2f] text-pink-600 h-[70vh] max-h-[70vh] p-4 space-y-4 flex-col justify-between overflow-auto w-[70vh] max-w-3xl"
        >
          <div>
            {messages.map((message) => (
              <div key={message.id} className="flex items-center space-x-4">
                <div className="w-32 flex-shrink-0 truncate">
                  <p
                    className="text-sm font-bold text-left truncate"
                    style={{ color: `${message.userColor}` }}
                  >
                    {message.user}
                  </p>
                </div>
                <div className="flex-grow text-left flex-wrap">
                  <p
                    className=" inline-block text-xl text-black rounded-lg p-2 m-2 max-w-[40vh]"
                    style={{
                      backgroundColor: `${message.userColor}`,
                      overflowWrap: "break-word",
                      color: `${getComplementaryColor(message.userColor)}`,
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </form>
        {shouldAutoScroll || (
          <button
            className="absolute bottom-6 right-9 bg-slate-900 hover:bg-zinc-700 rounded-lg p-1 w-10 h-10 flex justify-center items-center"
            onClick={handleDownButtonClick}
          >
            <FaArrowDown color="grey" />
          </button>
        )}
      </div>
      <Input
        handleKeyPress={handleKeyPress}
        handleSubmit={handleSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        inputRef={inputRef}
      />

      <div className="mt-3 text-lg max-w-[70vh]">
        Want to Enter A New Room?
        <input
          className="bg-zinc-600 rounded-lg p-1 mx-2"
          ref={roomInputRef}
          onKeyDown={handleChangeRoom}
        />
        <button
          className="bg-slate-900 hover:bg-zinc-700 rounded-lg p-1 w-20 m-2"
          onClick={changeRoom}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default Chat;

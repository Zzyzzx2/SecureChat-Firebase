import React, { useState } from "react";
import "../styles/emoticonStyles.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Input = ({
  setNewMessage,
  newMessage,
  handleKeyPress,
  handleSubmit,
  inputRef,
}) => {
  const [showEmoticons, setShowEmoticons] = useState(false);

  const handleEmoticonClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
    // setShowEmoticons(false);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".emoticon-container")) {
      setShowEmoticons(false);
    }
  };

  const handleEmojiButtonClick = (e) => {
    e.stopPropagation(); // Stop the click event from propagating to the wrapping div
    setShowEmoticons(!showEmoticons);
  };
  return (
    <div
      className="emoticon-container flex items-center justify-self-end relative max-w-[70vh] w-full"
      onClick={handleOutsideClick}
    >
      <input
        ref={inputRef}
        className="flex-grow bg-[#757c748b] p-2 rounded-md m-1 overflow-auto"
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        onKeyDown={handleKeyPress}
        style={{ outline: "2px solid #98ff98" }}
      />

      <button className="hover:bg-amber-300" onClick={handleEmojiButtonClick}>
        😊 {/* Display a default or placeholder emoticon */}
      </button>

      {showEmoticons && (
        <span className="absolute bottom-10 right-0 ">
          <Picker
            onEmojiSelect={handleEmoticonClick}
            emojiTooltip={true}
            title="Pick your emoji…"
            style={{
              position: "absolute",
              bottom: "50px",
              right: "0",
              zIndex: "10",
            }}
            onClickOutside={handleOutsideClick}
          />
        </span>
      )}
      <button
        type="submit"
        className="text-lime-500 p-2 border w-1/5 hover:bg-green-300 hover:text-green-600"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  );
};

export default Input;

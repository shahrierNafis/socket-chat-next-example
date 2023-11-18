"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
let socket: any;
console.log("render");

export default function Home() {
  const [input, setInput] = useState("");
  const messages = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
      console.log("connected");

      socket.on("message-server", addMessage);
    }; // Initialize the socket connection
    !socket && socketInitializer();
    // Clean up the socket connection on unmount
    return () => {
      socket?.disconnect();
      socket?.off("message-server", addMessage);
      console.log("disconnected");
    };
  }, []);

  function addMessage(msg: string) {
    const item = document.createElement("li");
    item.textContent = msg;
    messages?.current?.appendChild(item);
    console.log(msg);
    window.scrollTo(0, document.body.scrollHeight);
  }
  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!input) return;
    socket.emit("message-client", input);
    console.log(input);

    setInput("");
  }
  return (
    <>
      <ul ref={messages}></ul>
      <form id="form" action="">
        <input
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button onClick={onClick}>Send</button>
      </form>
    </>
  );
}

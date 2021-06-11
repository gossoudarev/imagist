import "./socket.io";
import React, { useState } from "react";

export function App() {
  const [loading, setLoading] = useState(false);
  const [imgPath, setImgPath] = useState('');
  const [connected, setConnected] = useState(false);
  let ws;

  async function submitHandler(event) {
    setLoading(true);
    event.preventDefault();
    const imageData = new FormData();
    imageData.append("image", event.target.elements.image.files[0]);
    const response = await fetch("api/upload", {
      method: "post",
      body: imageData
    });
    const { path } = await response.json();
    setLoading(false);
    setImgPath(path);
    initConnection();
  };

  function initConnection() {
    ws = io();
    ws.emit('path', imgPath);
    setConnected(true);
    ws.on('path', path => setImgPath(path));
  }

  return (
    <React.Fragment>
      <form onSubmit={submitHandler} className={connected ? "hidden" : ""}>
        <label className="btn btn--purple">
          Choose file
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
          />
        </label>
        <button className="btn btn--red" type="submit">
          {loading ? "Downloading..." : "Download"}
        </button>
      </form>
      <div className={connected ? "" : "hidden"}>
        <img src={imgPath} className="sm:w-1/2 w-full" />
        <button onClick={() => ws.emit('flip')}>
          <svg>
            <use href="./assets/flip.svg" />
          </svg>
        </button>
      </div>
    </React.Fragment>
  );
}

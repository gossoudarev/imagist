import "./socket.io";
import React, { useEffect, useState, useCallback } from "react";

export function App() {
  const [loading, setLoading] = useState(false);
  const [imgPath, setImgPath] = useState('');
  const [connected, setConnected] = useState(false);
  
  const submitHandler = useCallback(async (event) => {
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
    const ws = io();
    ws.emit('path', path);
    setConnected(true);
  }, []);

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
      <img src={imgPath} />
    </React.Fragment>
  );
}

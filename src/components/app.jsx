import React, { useState, useReducer } from "react";

export function App(props) {
  const [loading, setLoading] = useState(false);
  const [imgPath, setImgPath] = useState("");
  const [connected, setConnected] = useState(true);

  async function submitHandlerDownload(event) {
    setLoading(true);
    event.preventDefault();
    const imageData = new FormData();
    imageData.append("image", event.target.elements.image.files[0]);
    const response = await fetch("api/upload", {
      method: "post",
      body: imageData,
    });
    const { path } = await response.json();
    setLoading(false);
    setImgPath(path);
    props.ws.emit("path", path);
    props.ws.on("path", (path) => {
      console.log("path", path);
      setImgPath(path);
    });
    setConnected(true);
  }

  async function submitHandlerEdit(event) {

  }

  return (
    <React.Fragment>
      <form
        onSubmit={submitHandlerDownload}
        className={connected ? "hidden" : ""}
      >
        <label className="btn btn--purple">
          Choose file
          <input type="file" name="image" accept="image/*" className="hidden" />
        </label>
        <button className="btn btn--red" type="submit">
          {loading ? "Downloading..." : "Download"}
        </button>
      </form>
      <div className={connected ? "" : "hidden"}>
        <div className="sm:w-1/2 w-full">
          <img src={imgPath} />
        </div>
        <form onSubmit={submitHandlerEdit}>
          <fieldset>
            Flip:
            <label className="">
              Horisontal
              <input type="checkbox" className="hidden" name="flip-h" />
            </label>
            <label>
              Vertical
              <input type="checkbox" className="hidden" name="flip-v" />
            </label>
          </fieldset>
        </form>
        <button onClick={() => props.ws.emit("flip")}></button>
      </div>
    </React.Fragment>
  );
}

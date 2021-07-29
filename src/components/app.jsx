import React, { useState } from "react";


export function App(props) {
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState(false);
  const [inURL, setInURL] = useState(false);
  const [outURL, setOutURL] = useState(false);
  const maxFileSize = 15 * 1024 * 1024;

  async function submitHandlerUpload(event) {
    event.preventDefault();
    const file = event.target.elements.image.files[0];
    if (!file) return;
    if (file.size >= maxFileSize) {
      alert('Too large file!');
      return;
    }
    if (file.type !== 'image/png' || file.type !== 'image/jpeg') {
      alert('Please choose png or jpeg image!');
      return;
    }
    console.log(file.type);
    setFilename(file.name);
    setLoading(true);
    const blob = new Blob([file]);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = async () => {
      const request = {
        operation: 'upload',
        name: file.name,
        file: reader.result
      };

      let response = await fetch('https://ewo3spohhk.execute-api.us-east-2.amazonaws.com/default/Imagist', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      response = await response.json();
      if (response.success) {
        setInURL(reader.result);
      } else {
        alert(response.error);
      }
      setLoading(false);
    };
  }

  async function submitHandlerEdit(event) {
    event.preventDefault();
    setLoading(true);
    setOutURL(false);
    const {
      flip_h,
      flip_v,
      rotate,
      bg,
      resize_x,
      resize_y,
    } = event.target.elements;
    const request = {
      operation: 'transform',
      name: filename,
      actions: {
        flip_h: flip_h.checked,
        flip_v: flip_v.checked,
        rotate: parseInt(rotate.value),
        bg: bg.value,
        resize_x: parseInt(resize_x.value),
        resize_y: parseInt(resize_y.value),
      }
    };

    let response = await fetch('https://ewo3spohhk.execute-api.us-east-2.amazonaws.com/default/Imagist', {
      method: 'POST',
      body: JSON.stringify(request)
    });

    response = await response.json();
    if (response.success) {
      setOutURL(response.outURL);
    } else {
      alert(response.error);
    }
    setLoading(false);
  }

  async function downloadHandler(event) {
    event.preventDefault();
    const a = document.createElement('a');
    a.href = outURL;
    a.download = 'modified-' + filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function clearHandler(event) {
    event.preventDefault();
    setOutURL(false);
    setInURL(false);
  }

  return (
    <React.Fragment>
      <form
        onSubmit={submitHandlerUpload}
        className={inURL ? "hidden" : "text-center bg-blue-100"}
      >
        <h1 className="text-2xl sm:text-5xl mt-5">Wellcome to Imagist!</h1>
        <h2 className="text-lg sm:text-3xl my-2">Let's manipulate your image:</h2>
        <label className="inline-block btn btn--purple" disabled={loading}>
          Choose file
          <input type="file" name="image" accept="image/*" className="hidden" />
        </label>
        <button className="btn btn--red" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <div className={inURL ? "sm:flex" : "hidden"}>
        <div className="sm:w-1/2 w-full">
          <img src={outURL || inURL} className="mx-auto" />
        </div>
        <form onSubmit={submitHandlerEdit} className="sm:w-1/2 p-3 w-full">
          <fieldset>
            Flip:
            <br />
            <label>
              <input type="checkbox" className="hidden" name="flip_h" />
              <span className="hint">Horisontal</span>
            </label>
            <label>
              <input type="checkbox" className="hidden" name="flip_v" />
              <span className="hint">Vertical</span>
            </label>
          </fieldset>
          <div className="flex">
            <fieldset>
              Rotate:
              <br />
              <input type="number" className="form-input" name="rotate" min="0" max="359" placeholder="0-359" />
            </fieldset>
            <fieldset>
              Background:
              <br />
              <input type="color" className="form-input" name="bg" />
            </fieldset>
          </div>
          <fieldset>
            Resize:
            <br />
            <input type="number" className="form-input" name="resize_x" min="0" max="4999" placeholder="width" />
            <input type="number" className="form-input" name="resize_y" min="0" max="4999" placeholder="height" />
          </fieldset>
          <button type="submit" className="btn btn--green" disabled={loading}>{loading ? "Transforming..." : "Transform"}</button>
          <button onClick={downloadHandler} className="btn btn--purple" disabled={!outURL || loading}>Download</button>
          <button onClick={clearHandler} className="btn btn--red" disabled={loading}>Clear</button>
        </form>
      </div>
    </React.Fragment>
  );
}

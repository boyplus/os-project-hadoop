import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/test");
      console.log(res.data);
    };

    fetchData();
  });

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      setLoading(true);
      try {
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        setLoading(false);
        setFile(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fileChange = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <Fragment>
      <h1>Hadoop Word Count Application</h1>
      <button
        onClick={() => document.getElementById("file").click()}
        className="ui primary button"
      >
        Select File
        <input
          id="file"
          type="file"
          onChange={fileChange}
          style={{ display: "none" }}
          accept=".txt"
        ></input>
      </button>

      <button
        className="ui secondary button"
        onClick={uploadFile}
        disabled={loading || file == null}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </Fragment>
  );
};

export default App;

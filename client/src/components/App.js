import { Fragment, useEffect, useState } from "react";
import axios from "../axios/axios";
import Novels from './novels/Novels';

const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get("/api/test");
      console.log(res.data);

      res = await axios.get('/api/novels');
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
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop: '50px' }}>
        <h1>Novels Analysis by Hadoop System</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
          <div className="ui input">
            <h4 style={{ paddingRight: '10px' }}>Novel's name</h4>
            <input type="text" placeholder="Harry Potter" style={{ width: '300px' }} value={name} onChange={(e) => setName(e.target.value)}></input>
          </div>
          <div style={{ paddingTop: '10px' }}>
            <button
              onClick={() => document.getElementById("file").click()}
              className="ui primary button"
            >
              Select File
            </button>
            <input
              id="file"
              type="file"
              onChange={fileChange}
              style={{ display: "none" }}
              accept=".txt"
            ></input>

            <button
              className="ui secondary button"
              onClick={uploadFile}
              disabled={loading || file == null}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 30px' }}>
        <Novels></Novels>
      </div>

    </Fragment>
  );
};

export default App;

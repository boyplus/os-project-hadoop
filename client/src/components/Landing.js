import { Fragment, useEffect, useState } from "react";
import axios from "../axios/axios";
import Novels from './novels/Novels';


const Landing = (props) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [novels, setNovels] = useState([]);
  const [loadingNovels, setLoadingNovels] = useState(false);
  const fetchData = async () => {
    let res = await axios.get("/api/test");
    console.log(res.data);
  };
  const fetchNovels = async () => {
    setLoadingNovels(true);
    const res = await axios.get('/api/novels');
    setLoadingNovels(false);
    console.log(res.data);
    setNovels(res.data.novels);
  }
  useEffect(() => {
    fetchNovels();
    fetchData();
  }, []);

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      const fileName = name.replaceAll(' ', '-');
      formData.append("file", file, fileName + '.txt');
      setLoading(true);
      setSuccess(false);
      setError(false);
      try {
        await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess(true);
        setLoading(false);
        fetchNovels();
      } catch (error) {
        setLoading(false);
        setError(true);
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
          <h2>Upload a new novel</h2>
          <div className="ui input" style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ paddingRight: '10px', paddingTop: '8px' }}>Name:</p>
            <input type="text" placeholder="Harry Potter" style={{ width: '300px' }} value={name} onChange={(e) => setName(e.target.value)}></input>
          </div>
          <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ height: '20px' }}>
              {file ? <div>{file.name}</div> : null}
            </div>
            <div>
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
                disabled={loading || file == null || name.length === 0}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: '5px' }}>
          {loading ? <div>Uploading your novel into hadoop and run analysis...</div> : null}
          {success ? <div style={{ color: 'green' }}>Upload your novel and run novel analysis successfully</div> : null}
          {error ? <div style={{ color: 'red' }}>Something went wrong, please try again later</div> : null}
        </div>

      </div>
      <div>
        <Novels history={props.history} novels={novels} loading={loadingNovels}></Novels>
      </div>

    </Fragment>
  );
};

export default Landing;

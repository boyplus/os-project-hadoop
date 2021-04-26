import React, { Fragment, useEffect, useState } from 'react';
import axios from '../axios/axios';

const NovelPage = (props) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchData = async (name) => {
    setLoading(true);
    try {
      setError(false);
      const res = await axios.get('/api/novel', { params: { name } });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError(true);
    }
  }
  useEffect(() => {
    const name = props.match.params.name;
    setName(name);
    fetchData(name);
  }, []);

  const renderPage = () => {
    if (loading) return <div>Fetching Novel analysis from hadoop system...</div>
    if (data) {
      return <table className="ui celled table">
        <thead>
          <tr><th>Word</th><th>Count</th></tr>

        </thead>
        <tbody>
          {data.wordcount.map((el) => {
            return <tr><td data-label="Word">{el.word}</td><td data-label="Count">{el.count}</td></tr>
          })}
        </tbody>
      </table>
    }
  }

  return <Fragment>
    <div style={{ paddingTop: '50px' }}>
      <i class="angle left icon" onClick={() => props.history.push('/')} style={{ fontSize: '20px', cursor: 'pointer' }}></i>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Novel name: {name}</h1>
        </div>
        <button
          className="ui red button"
        >
          Delete
        </button>
      </div>

      {renderPage()}
      {error ? <div style={{ color: 'red' }}>Fetch data from hadoop fail, please try again later</div> : null}
    </div>
  </Fragment>
}

export default NovelPage;
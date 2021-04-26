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
      console.log(res.data)
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError(true);
    }
  }
  useEffect(() => {
    const name = props.match.params.name;
    console.log(name);
    setName(name);

    fetchData(name);
  }, []);

  return <Fragment>
    <div style={{ paddingTop: '50px' }}>
      <h1>Novel name: {name}</h1>
      {loading ? <div>Fetching Novel analysis from hadoop system...</div> : null}
      {error ? <div style={{ color: 'red' }}>Fetch data from hadoop fail, please try again later</div> : null}
      {data ? <div>
        {data.wordcount.map(el => {
          return <div key={el.word}>
            <p>{el.word}: {el.count}</p>
          </div>
        })}
      </div> : null}
    </div>
  </Fragment>
}

export default NovelPage;
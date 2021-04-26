import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../axios/axios';
import Novel from './Novel';

const Novels = () => {
  const [novels, setNovels] = useState([]);
  const [laoding, setloading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axios.get('/api/novels');
        setloading(false);
        setNovels(res.data.novels);
      } catch (err) {
      }
    }
    fetchData();
  }, [])
  return <Fragment>
    <div>
      <h1>Novels List</h1>
      <div style={{ display: 'flex' }}>
        {laoding ? <div>Fetching novel list from Hadoop File System...</div> : null}
        {novels.map((novel, index) => {
          return <div key={index}><Novel name={novel.name} date={novel.date}></Novel></div>
        })}
      </div>

    </div>
  </Fragment>
}

export default Novels;
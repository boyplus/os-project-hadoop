import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../axios/axios';
import Novel from './Novel';
import '../styles/card.css';

const Novels = (props) => {
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {laoding ? <div>Fetching novel list from Hadoop File System...</div> : null}
        {novels.map((novel, index) => {
          return <Novel key={novel.name} name={novel.name} date={novel.date} history={props.history}></Novel>
        })}
      </div>
    </div>
  </Fragment>
}

export default Novels;
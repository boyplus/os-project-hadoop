import React, { Fragment } from 'react';
import Novel from './Novel';
import '../styles/card.css';

const Novels = ({ history, loading, novels }) => {
  return <Fragment>
    <div>
      <h1>Novels List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {loading ? <div>Fetching novel list from Hadoop File System...</div> : <Fragment>
          {novels.map((novel, index) => {
            return <Novel key={novel.name} name={novel.name} date={novel.date} history={history}></Novel>
          })}
        </Fragment>}

      </div>
    </div>
  </Fragment>
}

export default Novels;
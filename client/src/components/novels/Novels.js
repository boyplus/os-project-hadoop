import React, { Fragment, useEffect } from 'react';
import Novel from './Novel';

const Novels = () => {
  const novels = [{ name: 'Hary Potter', date: '2021-04-26' }, { name: 'Hary Potter', date: '2021-04-26' }, { name: 'Hary Potter', date: '2021-04-26' }];
  return <Fragment>
    <div>
      <h1>Novels List</h1>
      <div style={{ display: 'flex' }}>
        {novels.map((novel, index) => {
          return <div key={index}><Novel name={novel.name} date={novel.date}></Novel></div>
        })}
      </div>

    </div>
  </Fragment>
}

export default Novels;
import React, { Fragment } from 'react';
import '../styles/card.css';

const Novel = ({ name, date, history }) => {
  return <Fragment>
    <div className="my-card" onClick={() => {
      history.push('/novel/' + name);
    }}>
      <h4>{name}</h4>
      <h6>{date}</h6>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p>See analysis</p>
      </div>

    </div>
  </Fragment>
}

export default Novel;
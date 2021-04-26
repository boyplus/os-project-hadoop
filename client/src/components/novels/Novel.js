import React, { Fragment } from 'react';
import '../styles/card.css';

const Novel = ({ name, date }) => {
  return <Fragment>

    <div className="card">
      <h4>{name}</h4>
      <h6>{date}</h6>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p>See analysis</p>
      </div>

    </div>
  </Fragment>
}

export default Novel;
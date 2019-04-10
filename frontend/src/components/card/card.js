import React from 'react';

import { withMemo } from '../hoc';

import './card.scss';

const Card = (props) => {
    const { data: { title, desc, level, date }, ...dynamicProps } = props;

    return(
        <div 
            className="card" 
            {...dynamicProps}
        >
            <div className={`card__badge card__badge_${level}`}></div>
            <div className="card__title">{title}</div>
            <div className="card__description">{desc}</div>
            <div className="card__date">created {date}</div>
        </div>
    )
}

export default withMemo(Card);
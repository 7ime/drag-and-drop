import React from 'react';

import { withMemo } from '../hoc';

import './card.scss';

const Card = (props) => {
    const { data: { title, desc, mod, id }, ...dynamicProps } = props;

    return(
        <div 
            className="card" 
            {...dynamicProps}
        >
            <div className={`card__badge card__badge_${mod}`}></div>
            <div className="card__title">{title}, {id}</div>
            <div className="card__description">{desc}</div>
        </div>
    )
}

export default withMemo(Card);
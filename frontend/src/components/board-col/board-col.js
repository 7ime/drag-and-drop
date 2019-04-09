import React, { Component } from 'react';

import CardList from '../card-list';

import './board-col.scss';

class BoardCol extends Component {
    render() {
        const { name, title, cards } = this.props;

        return(
            <div className="board-col" data-col={name}>
                <div className="board-col__header">
                    <div className="board-col__title">{title}</div>
                    <div className="board-col__count">{cards.length} units</div>
                </div>
                <CardList cards={cards}/>
            </div>
        )
    }
}

export default BoardCol;


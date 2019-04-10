import React, { Component } from 'react';

import CardList from '../card-list';

import './board-col.scss';

class BoardCol extends Component {
    shouldComponentUpdate({ cards: newCards }) {
        const { cards } = this.props;

        if(cards.length !== newCards.length) {
            return true;
        }
        
        for(let i = 0; i < cards.length; i++) {
            if(cards[i].id === newCards[i].id) {
                continue
            } else {
                return true;
            }
        }

        return false;
    }


    render() {
        const { id, title, cards, events } = this.props;
        return(
            <div className="board-col" data-col={id}>
                <div className="board-col__header">
                    <div className="board-col__title">{title}</div>
                    <div className="board-col__count">{cards.length} units</div>
                </div>
                <CardList cards={cards} events={events} colName={title}/>
            </div>
        )
    }
}

export default BoardCol;


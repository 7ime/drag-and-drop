import React, { Component } from 'react';

import Card from '../card';

import './card-list.scss';

class CardList extends Component {

    getCards = (items, events, colName) => {
        return items.map((item) => {
            const { id } = item;
    
            return(
                <React.Fragment key={id}>
                    <Card 
                        data={item}
                        data-card-id={id} 
                        draggable
                        colName={colName} 
                        {...events}
                    />
                </React.Fragment>
            )
        })
    }

    render() {
        const { 
            cards, 
            events: { list: eventsList, item: eventsItem }, 
            colName } = this.props;

        const elCards = this.getCards(cards, eventsItem, colName);

        return(
            <div className="card-list">
                <div 
                    className="card-list__container-wrap scrollbar"
                    {...eventsList}
                >
                    {elCards}
                    <div className="card-list__fill card-list-fill-js"></div>
                </div>
            </div>     
        )
    }
}

export default CardList;
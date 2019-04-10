import React from 'react';

import BoardCol from '../../board-col';

export function getCols(items) {
    return items.map((item) => {
        return(
            <React.Fragment key={item.id}>
                <BoardCol {...item} events={this.getEvents()}/>
            </React.Fragment>
        )
    });
}
import React, { Component } from 'react';

import Data from './board-data.json';

import { BoardProvider } from '../context/board-context';
import BoardCol from '../board-col';

import './board.scss';


class Board extends Component {
    
    state = {
        data: Data.boardData
    };

    _underCardIdHistory = null;

    setUnderCardIdHistory = (value) => {
        this._underCardIdHistory = value;    
    }

    getUnderCardIdHistory = () => {
        return this._underCardIdHistory;
    }

    customSetState = (obj) => {  
        this.setState({
            data: obj
        })
    }

    getCols = (items) => {
        return items.map((item) => {
            return(
                <React.Fragment key={item.name}>
                    <BoardCol {...item}/>
                </React.Fragment>
            )
        });
    }

    render() {
        const { data } = this.state;

        const provaiderValue = {
            data,
            customSetState: this.customSetState,
            setUnderCardIdHistory: this.setUnderCardIdHistory,
            getUnderCardIdHistory: this.getUnderCardIdHistory
        }

        const cols = this.getCols(data);

        return(
            <BoardProvider value={provaiderValue}>
                <div className="board">
                    {cols}
                </div>
            </BoardProvider>
        )
    }
}

export default Board;
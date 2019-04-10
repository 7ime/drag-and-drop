import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoardCol from '../board-col';

import './board.scss';

class Board extends Component {
    getCols = (items) => {
        return items.map((item) => {
            return(
                <React.Fragment key={item.id}>
                    <BoardCol {...item}/>
                </React.Fragment>
            )
        });
    }

    render() {
        const cols = this.getCols(this.props.boardData);

        return(
            <div className="board">
                {cols}
            </div>
        )
    }
}

const mapStateToProps = ({ boardData }) => ({ boardData});

export default connect(mapStateToProps)(Board);
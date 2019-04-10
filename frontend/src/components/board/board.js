import React, { Component } from 'react';
import { connect } from 'react-redux';

import { boardDataUpdate } from '../../actions';

import { 
    handleDragStart,
    handleDrag,
    handleDragEnter, 
    handleDragLeave, 
    handleDragOver,
    handleDrop, 
    handleDragEnd,
    handleMouseDown,
    clearBoardColIsActive,
    clearAfterDropOrEnd,
    createStub,
    removeStub,
    getEvents,
    getCols } from './board-methods';

import './board.scss';

class Board extends Component {
    constructor(props) {
        super(props);

        this.countForDragEnterLeave = 0;
        this.cardHeight = 0;

        this.handleDragStart        = handleDragStart.bind(this);
        this.handleDrag             = handleDrag.bind(this);
        this.handleDragEnter        = handleDragEnter.bind(this);
        this.handleDragLeave        = handleDragLeave.bind(this);
        this.handleDragOver         = handleDragOver.bind(this);
        this.handleDrop             = handleDrop.bind(this);
        this.handleDragEnd          = handleDragEnd.bind(this);
        this.handleMouseDown        = handleMouseDown.bind(this);

        this.clearBoardColIsActive  = clearBoardColIsActive.bind(this);
        this.clearAfterDropOrEnd    = clearAfterDropOrEnd.bind(this);
        this.createStub             = createStub.bind(this);
        this.removeStub             = removeStub.bind(this);
        this.getEvents              = getEvents.bind(this);
        this.getCols                = getCols.bind(this);                 
    }

    render() {
        const cols = this.getCols(this.props.boardData);

        return(
            <div className="board" onMouseDown={this.handleMouseDown}>
                {cols}
            </div>
        )
    }
}

const mapStateToProps = ({ boardData }) => ({ boardData});

const mapDispatchToProps = (dispatch) => ({
    boardDataUpdate: (ownProps) => dispatch(boardDataUpdate(ownProps)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
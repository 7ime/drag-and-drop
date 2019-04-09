import React from 'react';

import { BoardConsumer } from '../context/board-context';

const withBoardContext = (Wrapped) => {
    return (props) => {
        return(
            <BoardConsumer>
                {
                    (value) => {
                        return(
                            <Wrapped {...props} provaider={value} />
                        )
                    }
                }
            </BoardConsumer>
        )
    }
}

export default withBoardContext;
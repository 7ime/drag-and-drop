import React, { Component } from 'react';

import Board from '../board';

class App extends Component {
    render() {
        return(
            <div className="wrapper">
                <div className="container">
                    <Board />
                </div>
            </div>
        )
    }
}

export default App;
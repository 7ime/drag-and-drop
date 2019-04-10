import React, { Component } from 'react';

import Board from '../board';

class App extends Component {
    componentDidMount() {
        this.removePreloader();
    }

    removePreloader() {
        const body = document.querySelector('body');
        const preloader = document.getElementById('preloader');
        body.removeChild(preloader);
    }

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
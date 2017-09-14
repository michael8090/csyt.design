import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDom from 'react-dom';
import './vendor';

import './index.scss';

function App() {
    return (
        <CSSTransitionGroup
            transitionName='gentle'
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
        >
            <div className='app'>hello csyt</div>
        </CSSTransitionGroup>
    );
}

ReactDom.render(<App />, document.body);

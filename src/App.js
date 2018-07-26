import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from './Chat';
import './styles.css'

class App extends Component {
  render() {
    const { feed, sendMessage } = this.props;

    return (
      <div className="container">
        <div className="container p-2 pt-4 bg-dark text-white">
          <h2>Dialogflow Redux Text</h2>
        </div>
        <div className="bg-secondary">
          <small>POWERED BY HELIUM</small>
        </div>
        <div className="container p-2">
          <ul>
            {feed.map((entry, i) => 
              <li key={i}>
                {entry.text}
              </li>
            )}
          </ul>
          <input type="text" 
            onKeyDown={(event) => event.keyCode === 13 ? sendMessage(event.target.value) : null } />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ feed: state });

export default connect(mapStateToProps, { sendMessage })(App);
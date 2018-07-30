import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMessage} from './Chat';
import './styles.css'
import ChatHeader from './ChatHeader.js'

class ChatBot extends Component {

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this
        .props
        .sendMessage(event.target.value)
      event.target.value = ""
    }
  }

  render() {
    const {feed} = this.props;
    const serverFeed = feed.map((entry, i) => {
      switch (entry.sender) {
        case "server":
          return (
            <div className="server-response float-left" key={i}>
              {entry.text}
            </div>
          );
        case "user":
          return (
            <div className="user-request float-right" key={i}>
              {entry.text}
            </div>
          );
        default:
          return (null);
      }
    })

    return (
      <div className="container-fluid pt-2">
        <div className="chat-container bg-white">
          <ChatHeader name="Katie"/>
          <div className="chat-result w-100 pt-4">
            {/* main content */}
            <table className="chat-table">
              <tbody>
                <tr>
                  <td id="result" className="">
                    <div>
                      {serverFeed}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="chat-input p-1">
            <div id="chatForm" className="h-100 w-100">
              <input
                id="query"
                autoComplete="off"
                autoFocus="true"
                inputMode="text"
                className="h-100 w-100 p-2"
                type="text"
                onKeyPress={this.handleKeyPress}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({feed: state});

export default connect(mapStateToProps, {sendMessage})(ChatBot);
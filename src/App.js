import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMessage} from './Chat';
import './styles.css'

class App extends Component {
  render() {
    const {feed, sendMessage} = this.props;
    const serverFeed = feed.map((entry, i) => {

      switch (entry.sender) {
        case "server":
          return (
            <div className="server-response float-right" key={i}>
              {entry.text}
            </div>
          );
        case "user":
          return (
            <div className="user-request float-left" key={i}>
              {entry.text}
            </div>
          );
        default:
          break;
      }
    })

    return (
      <div id="content" className="">
        {/* temp header */}
        <header>
          <div className="w-100">
            <img className="header-img-logo" src="./images/helium-logo.png" alt=""/>
          </div>
          <img className="header-text-logo" src="./images/helium-text-logo.png" alt=""/>
          <div className="blue-bar py-2 text-center w-100">
            <h4>( Dialogflow Redux Mockup )</h4>
          </div>
        </header>

        {/* <Main /> */}
        <div className="container-fluid pt-2">
          <div className="chat-container bg-white">
            <div className="chat-header">
              <div className="chat-header-wrapper w-100 d-flex align-items-center text-white">
                <div className="chat-icon text-center d-inline-block d-inline-block m-4">
                  <img className="chat-img-logo" src="./images/helium-white-icon.png" alt=""/>
                </div>
                <div className="d-inline-block">
                  <div className="chat-title">
                    <h4 className="font-weight-normal p-0">Katie</h4>
                  </div>
                  <div className="chat-subtitle font-weight-light">
                    Helium Services
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-top-nav text-right p-2 small">
              <span className="text-white-50">POWERED BY
              </span>
              <strong className="text-light">HELIUM</strong>
            </div>

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
              <div id="chatForm" className="h-100 w-100" action="">
                <input
                  id="query"
                  className="h-100 w-100 p-2"
                  type="text"
                  onKeyDown={(event) => event.keyCode === 13
                  ? sendMessage(event.target.value)
                  : null}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({feed: state});

export default connect(mapStateToProps, {sendMessage})(App);
import React, {Component} from 'react'
import ChatBot from './ChatBot.js'
import UserInfoForm from './UserInfoForm.js'
import './styles.css'

export default class App extends Component {
  state = {
    haveUserInfo: false
  }

  toggleHaveUserInfo = () => {
    this.setState({
      haveUserInfo: !this.state.haveUserInfo
    })
  }

  render() {

    return (
      <div id="content" className="">
        <header>
          <div className="w-100">
            <br />
            <br />
          </div>
          <div className="blue-bar py-2 text-center w-100">
            <h4>Dialogflow React-Redux Mockup</h4>
          </div>
        </header>
        <br />
        {this.state.haveUserInfo
          ? <ChatBot/>
          : <UserInfoForm toggleHaveUserInfo={this.toggleHaveUserInfo}/>}
      </div>
    )
  }
}
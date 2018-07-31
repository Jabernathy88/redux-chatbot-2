import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMessage} from './Chat.js';
import ChatHeader from './ChatHeader.js'

class UserInfoForm extends Component {
  state = {
    userInfo: {
      name: "",
      phone: "",
      email: ""
    }
  }

  handleChange = (event) => {
    const updatedUser = {
      ...this.state.userInfo
    }
    const inputField = event.target.name
    const inputValue = event.target.value
    updatedUser[inputField] = inputValue

    this.setState({userInfo: updatedUser})
  }

  handleSubmit = () => {
    if (this.state.userInfo.name === "" && this.state.userInfo.phone === "") {
      alert("I'm sorry, but I'll need at least a name and phone number before moving on.")
    } else {
      this
        .props
        .sendMessage(`Hi, I'm ${this.state.userInfo.name}. You can reach me at ${this.state.userInfo.phone}
    ${this.state.userInfo.email}`)
      this.setState({
        userInfo: {
          name: "",
          phone: "",
          email: ""
        }
      })
      this
        .props
        .toggleHaveUserInfo()
    }

  }

  render() {
    return (
      <div className="container-fluid pt-2">
        <div className="chat-container bg-white">
          <ChatHeader name="User Info"/>
          <div className="w-100 pt-4 user-info">
            {/* main content */}
            <div className="info-field">

              <div htmlFor="name">Name:</div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                onChange={this.handleChange}
                value={this.state.userInfo.name}/>
            </div>
            <div className="info-field">
              <div htmlFor="phone">Phone Number:
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="123-456-7890"
                onChange={this.handleChange}
                value={this.state.userInfo.phone}/>
            </div>
            <div className="info-field">

              <div htmlFor="email">E-mail:
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                onChange={this.handleChange}
                value={this.state.userInfo.email}/>
            </div>
          </div>

          <div className="chat-input p-1">
            <div id="chatForm" className="h-100 w-100">
              <button className="h-100 w-100 start-chat-button" onClick={this.handleSubmit}>Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, {sendMessage})(UserInfoForm);
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
    this
      .props
      .sendMessage("Namaste")
    this
      .props
      .setHaveUserInfoToTrue()
    this.setState({
      userInfo: {
        name: "",
        phone: "",
        email: ""
      }
    })
  }

  render() {
    return (
      <div className="container-fluid pt-2">
        <div className="chat-container bg-white">
          <ChatHeader name="User Info"/>
          <div className="chat-result w-100 pt-4">
            {/* main content */}
            <div>
              <label htmlFor="name">Name
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.handleChange}
                  value={this.state.userInfo.name}/>
              </label>
              <label htmlFor="phone">Phone Number
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  onChange={this.handleChange}
                  value={this.state.userInfo.phone}/>
              </label>
              <label htmlFor="email">E-mail
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={this.handleChange}
                  value={this.state.userInfo.email}/>
              </label>
              <button onClick={this.handleSubmit}>Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, {sendMessage})(UserInfoForm);
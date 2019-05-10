import React from 'react';

const ChatHeader = (props) => {
  return (
    <div>
      <div className="chat-header">
        <div className="chat-header-wrapper w-100 d-flex align-items-center text-white">
          <div className="chat-icon text-center d-inline-block d-inline-block m-4">
            <img className="chat-img-logo" src="./images/helium-white-icon.png" alt=""/>
          </div>
          <div className="d-inline-block">
            <div className="chat-title">
              <h4 className="font-weight-normal p-0">{props.name}</h4>
            </div>
            <div className="chat-subtitle font-weight-light">
              {/* Helium Services */}
            </div>
          </div>
        </div>
      </div>
      <div className="chat-top-nav text-right p-2 small">
        {/* <span className="text-white-50">POWERED BY
        </span>
        <strong className="text-light">DIALOGFLOW</strong> */}
      </div>
    </div>
  );
};

export default ChatHeader;
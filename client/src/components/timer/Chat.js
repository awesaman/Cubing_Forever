import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
let socket = io('http://localhost:5000');
let chatbox;
let store = [];

const Chat = ({ auth: { user } }) => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  const onChange = e => {
    setMessage(e.target.value);
  };

  const sendMessage = e => {
    e.preventDefault();

    let text = message;
    let username = user.username;
    let avatar = user.avatar;
    let timestamp = moment().format('hh:mm a');

    socket.emit('chat message', {
      text,
      avatar,
      username,
      timestamp,
    });
    setMessage('');
  };

  useEffect(() => {
    socket.on('chat message', msg => {
      setChats([...store, msg]);
    });
  }, []);

  useEffect(() => {
    chatbox = document.getElementById('chat-box');
    chatbox.scrollTop = chatbox.scrollHeight;
    store = chats;
  }, [chats]);

  return (
    <Fragment>
      <div>
        <div className='scrollable' id='chat-box'>
          {chats.length > 0 &&
            chats.map((chat, i) => (
              <div key={i} className='chat'>
                <img
                  src={chat.avatar}
                  alt='Please provide an avatar through Gravatar'
                  className='chat-image'
                />
                <div>
                  <small className='text-light'>{chat.username}</small>
                  <p>{chat.text}</p>
                </div>
                <small className='mleft gray'>{chat.timestamp}</small>
              </div>
            ))}
        </div>
        <form onSubmit={sendMessage} className='form'>
          <div className='message-box'>
            <input
              id='message'
              placeholder='Send a message'
              type='text'
              value={message}
              onChange={onChange}
            />

            <button onClick={sendMessage} className='btn btn-primary send'>
              SEND
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

Chat.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Chat);

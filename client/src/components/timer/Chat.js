import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { receiveMessage } from '../../actions/room';
import moment from 'moment';
import PropTypes from 'prop-types';
let chatbox;

const Chat = ({ socket, room, auth: { user }, receiveMessage }) => {
  const [message, setMessage] = useState('');

  const onChange = e => {
    setMessage(e.target.value);
  };

  const sendMessage = e => {
    e.preventDefault();

    const msg = {
      text: message,
      username: user.username,
      avatar: user.avatar,
      timestamp: moment().format('hh:mm a'),
    };
    socket.emit('input message', room.roomID, msg);
    receiveMessage(msg);
    setMessage('');
  };

  useEffect(() => {
    if (room.roomID === '') {
      let url = window.location.href.split('/');
      room.roomID = url[url.length - 1];
    }

    socket.on('user connected', (socketID, msg) => {
      receiveMessage(msg);
    });

    socket.on('output message', msg => {
      receiveMessage(msg);
    });
  }, []);

  useEffect(() => {
    chatbox = document.getElementById('chat-box');
    chatbox.scrollTop = chatbox.scrollHeight;
  }, [room.chats]);

  return (
    <Fragment>
      <div>
        <div className='scrollable' id='chat-box'>
          {room.chats.length > 0 &&
            room.chats.map((chat, i) => (
              <div key={i} className='chat'>
                <img
                  src={chat.avatar}
                  alt='Please provide an avatar through Gravatar'
                  className='chat-image'
                />
                <div>
                  <small className='text-light'>{chat.username}</small>
                  <p className={chat.first ? 'text-light' : 'text-primary'}>
                    {chat.text}
                  </p>
                </div>
                <small className='mleft gray'>{chat.timestamp}</small>
              </div>
            ))}
        </div>
        <form onSubmit={receiveMessage} className='form'>
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
  room: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  receiveMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    room: state.room,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { receiveMessage })(Chat);

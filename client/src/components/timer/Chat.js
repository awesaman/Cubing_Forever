import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
let chatbox;
let store = [];

const Chat = ({ socket, room, auth: { user } }) => {
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

    socket.emit('input message', room.roomID, {
      text,
      avatar,
      username,
      timestamp,
    });
    setChats([
      ...store,
      {
        text,
        avatar,
        username,
        timestamp,
      },
    ]);
    console.log('attempting to send');
    setMessage('');
  };

  useEffect(() => {
    if (room.roomID === '') {
      let url = window.location.href.split('/');
      console.log(url[url.length - 1]);
      room.roomID = url[url.length - 1];
    }
    console.log('but other things are happening');
    socket.emit('join room', room.roomID, {
      text: 'JOINED THE ROOM',
      username: user.username,
      avatar: user.avatar,
      timestamp: moment().format('hh:mm a'),
    });
    socket.on('user connected', msg => {
      setChats([...store, msg]);
    });
    socket.on('output message', msg => {
      console.log('msg.text');
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
  room: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    room: state.room,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Chat);

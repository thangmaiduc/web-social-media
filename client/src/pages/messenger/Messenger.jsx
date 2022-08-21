import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/slices/userSlice';
import useTyping from '../../hooks/useTyping';
import conversationApi from '../../api/conversationApi';
import NewMessageForm from '../../components/newMessageForm/NewMessageForm';
import commonApi from '../../api/commonApi';

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const socketRef = useRef();
  const user = useSelector(userSelector);
  const scrollRef = useRef();
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();

  const sendMessage = async () => {
    // if (!socketRef.current) return;
    let messageObject = {
      conversationId: currentChat.conversationId,
      text: newMessage,
    };
    if (file) {
      messageObject = {
        ...messageObject,
        fileUrl
      };
      setNewMessage('');
      setFile();
      // socketRef.current.emit('send message', messageObject);
    }
    const message = await conversationApi.newMessage(messageObject)
    setMessages(m => [...m, message])
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    // cancelTyping();
    sendMessage(newMessage);
    setNewMessage('');
  };

  // useEffect(() => {
  //   socket.current = io('ws://localhost:8900');
  //   socket.current.on('getMessage', (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // }, []);

  // useEffect(() => {
  //   arrivalMessage &&
  //     currentChat?.members.includes(arrivalMessage.sender) &&
  //     setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //   socket.current.emit('addUser', user._id);
  //   socket.current.on('getUsers', (users) => {
  //     setOnlineUsers(
  //       user.followings.filter((f) => users.some((u) => u.userId === f))
  //     );
  //   });
  // }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await conversationApi.getOfUser();
        // console.log('user', res);
        setConversations(res);
      } catch (err) { }
    };
    getConversations();
  }, [user.id]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await  conversationApi.getMessage(
          currentChat?.conversationId
        );
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const startTypingMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('start typing message', {
      senderId: socketRef.current.id,
      user,
    });
  };

  const stopTypingMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('stop typing message', {
      senderId: socketRef.current.id,
      user,
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  async function selectFile(e) {
    if (typeof e.target.files[0] !== 'undefined') {
      const uploadData = new FormData();
      uploadData.append('file', e.target.files[0], 'file');
      setFile(e.target.files[0]);
      const res = await commonApi.cloudinaryUpload(uploadData);
      setFileUrl(res.secure_url);
    } else {
      return null;
    }
  }
  useEffect(() => {
    if (isTyping) startTypingMessage();
    else {
      stopTypingMessage();
    }
  }, [isTyping]);
  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <input placeholder='Search for friends' className='chatMenuInput' />
            {conversations.length > 0 &&
              conversations.map((c) => (
                <div key={c?.conversationId} onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((m) => (
                    <div key={m.id} ref={scrollRef}>
                      <Message message={m} own={m.senderId === user.id} />
                    </div>
                  ))}
                </div>
                <NewMessageForm
                  selectFile={selectFile}
                  file={file}
                  setFile={setFile}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleStartTyping={startTyping}
                  handleStopTyping={stopTyping}
                  handleSubmit={handleSendMessage}
                />
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className='chatOnline'>
          <div className='chatOnlineWrapper'>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}

import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { userSelector, friendSelector } from '../../redux/slices/userSlice';
import useTyping from '../../hooks/useTyping';
import conversationApi from '../../api/conversationApi';
import NewMessageForm from '../../components/newMessageForm/NewMessageForm';
import commonApi from '../../api/commonApi';
import { Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Autocomplete } from '@mui/material';
import { notify } from '../../utility/toast';
import useQuery from '../../hooks/useQuery';
import useQuerySearch from '../../hooks/useQuerySearch';
import api from '../../api/API';
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
  const friends = useSelector(friendSelector);
  const scrollRef = useRef();
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [isAdd, setIsAdd] = useState(false)
  const [value, setValue] = useState([]);
  const fixedOptions = []
  const [textSearch, setTextSearch] = useState('')
  const [page, setPage] = useState(0)
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
        const res = await conversationApi.getMessage(
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
  const handleAdd = () => {
    setIsAdd(true);
    setCurrentChat(false)
  }
  const handleSubmit = async () => {
    setIsAdd(false);
    try {
      let memberIds = value.map(member => member.followedId)
      let res = await conversationApi.newConversation({ users: memberIds });
      notify(res.message);
      setConversations()
    } catch (error) {

    }
  }
  
  let { data, loading, hasMore, error } = useQuery(api.GET_CONVERSATIONS, page, textSearch);
  useEffect(() => {
    console.log('data',data);
   }, [data]);
  const observer = useRef()

  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])
  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <div className="topChatMenu">

              <input placeholder='Search for friends' className='chatMenuInput' value={textSearch} onChange={(e)=>setTextSearch(e.target.value)}/>
              < Button size='small' variant="contained"
                color='primary'
                startIcon={<Add />} onClick={
                  handleAdd
                }>
                Thêm cuộc trò chuyện
              </Button>
            </div>
            {data.length > 0 &&
              data.map((c) => (
                <div ref={lastBookElementRef} key={c?.conversationId} onClick={() => { setIsAdd(false); setCurrentChat(c) }}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className="chatTitle">
            {isAdd && <> <Autocomplete
              multiple
              fullWidth={true}
              id="tags-standard"
              options={friends}
              getOptionLabel={(option) => option.fullName}
              value={value}
              onChange={(event, newValue) => {
                setValue([
                  ...fixedOptions,
                  ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
                ]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Multiple values"
                  placeholder="Favorites"
                />
              )}
            />
              < Button size='small' variant="contained"
                color='primary'
                startIcon={<Add />} onClick={
                  handleSubmit
                }>
                Tạo
              </Button>
            </>
            }
          </div>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className="chatTitle">
                  <img className="sidebarFriendImg" src={user.profilePicture} alt="" />
                  <span className="sidebarFriendName">{user.fullName}</span>
                </div>
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
              currentId={user.id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}

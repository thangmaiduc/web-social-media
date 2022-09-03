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
import { Button, TextField, Tooltip } from '@material-ui/core';
import { Add, AddOutlined, Close, Edit, PersonAdd, PersonAddDisabled } from '@material-ui/icons';
import { Autocomplete } from '@mui/material';
import { notify } from '../../utility/toast';
import useQuery from '../../hooks/useQuery';
import useQuerySearch from '../../hooks/useQuerySearch';
import api from '../../api/API';
import userApi from '../../api/userApi';
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
  const [title, setTitle] = useState('')
  const [page, setPage] = useState(0)
  const [lengthMes, setLengthMes] = useState(0)
  const [pageMessage, setPageMessage] = useState(0)
  const [isEdited, setIsEdited] = useState(false)
  const sendMessage = async () => {
    if (!socketRef.current) return;
    let messageObject = {
      senderId: user.id,
      conversationId: currentChat.conversationId,
      text: newMessage,
    };
    let objMesSocket = {
      senderId: user.id,
      receiverId: currentChat.userId,
      text: newMessage,
    }
    if (file) {
      messageObject = {
        ...messageObject,
        fileUrl
      };
      objMesSocket = {
        ...objMesSocket,
        fileUrl
      };
      setNewMessage('');
      setFile();
    }
    socketRef.current.emit('sendMessage', objMesSocket);
    const message = await conversationApi.newMessage(messageObject)
    setMessages(m => [...m, message])
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };

  useEffect(() => {
    socketRef.current = io('ws://localhost:8900');
    socketRef.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        fileUrl: data.fileUrl
      });
    });
  }, []);

  useEffect(() => {
    const getMessage = async () => {
      console.log('currentChat', currentChat);
      console.log('arrivalMessage', arrivalMessage);
      if (arrivalMessage &&
        currentChat.userId === arrivalMessage.sender) {
        const sender = await userApi.getUserById(arrivalMessage.sender)
        let obj = {
          ...arrivalMessage,
          createdAt: Date.now(),
        }
        obj.profilePicture = sender.profilePicture;
        console.log('obj', obj);
        setMessages((prev) => [...prev, obj]);
      }
    }
    getMessage()
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socketRef.current.emit('addUser', user.id);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await conversationApi.getOfUser();
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
        setMessages(res.data);
        setLengthMes(res.length);
        setTitle(currentChat?.title)

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
      if (!currentChat) {
        let memberIds = value.map(member => member.followedId)
        let res = await conversationApi.newConversation({ users: memberIds });
        notify(res.message);
        setConversations(pre => [,...pre, res.data])
        setCurrentChat(res.data)
      } else {
        let memberIds = value.map(member => member.followedId)
        let res = await conversationApi.addMember(currentChat.conversationId, { users: memberIds });
        notify(res.message);
      }
    } catch (error) {

    }
  }

  let { data, loading, hasMore, error } = useQuery(api.GET_CONVERSATIONS, page,);
  useEffect(() => {
    setConversations(data)
  }, [data]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await conversationApi.getOfUser({ params: { textSearch } })
        setConversations(res);
      } catch (error) {

      }
    }
    getConversations()
  }, [textSearch]);
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
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await conversationApi.getMessage(
          currentChat?.conversationId, {
          params: {
            page: pageMessage
          }
        }
        );
        setMessages([...res.data, ...messages]);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [pageMessage])

  const handleShowMore = () => {
    if ((pageMessage + 1) * 10 > lengthMes) return
    if ((pageMessage + 1) * 10 < lengthMes) {
      setPageMessage(p => p + 1)
    }
  }

  const handleRename =async () => {
    setIsEdited(false);
    try {
      const res = await conversationApi.editConversation(currentChat.conversationId, {title});
      notify(res.message);
      conversations.forEach(c=>{
        if( c.conversationId === res.data.id)
        {
          c.title = res.data.title;
          setCurrentChat(c);
        }
      })
      setConversations(conversations)
    } catch (error) {
      
    }
  }

  const handleAddMember = async () => {
    setIsAdd(true);
    const res = await conversationApi.getMember(currentChat.conversationId);
    setValue(res)

  }
  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <div className="topChatMenu">

              <input placeholder='Search for friends' className='chatMenuInput' value={textSearch} onChange={(e) => setTextSearch(e.target.value)} />
              < Button size='small' variant="contained"
                color='primary'
                startIcon={<Add />} onClick={
                  handleAdd
                }>
                Thêm cuộc trò chuyện
              </Button>
            </div>
            {conversations.length > 0 &&
              conversations.map((c, i) => (
                <div ref={lastBookElementRef} key={i} onClick={() => { setIsAdd(false); setCurrentChat(c) ; setIsEdited(false) }}>
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
              getOptionLabel={(option) => option.fullName || ''}
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
                Thêm
              </Button>
            </>
            }
          </div>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                {currentChat.type === 'private' ?
                  <div className="chatTitle">
                    <img className="sidebarFriendImg" src={currentChat?.User?.profilePicture|| currentChat?.img} alt="" />
                    <span className="sidebarFriendName">{currentChat?.User?.fullName || currentChat?.title}</span>
                  </div> :
                  <div className="chatTitle">
                    <img className="sidebarFriendImg" src={currentChat?.img} alt="" />
                    {!isEdited ? <span className="sidebarFriendName">{currentChat?.title}</span> :
                      <div>

                        <TextField id="outlined-search"  value={title} onChange={(e)=>setTitle(e.target.value)}/>
                       
                        < Button size='small' variant="contained"
                          color='primary'
                          onClick={
                            handleRename
                          }>
                          Sửa tên
                        </Button>
                      </div>
                    }
                    <div className="chatTitleRight">
                    {(currentChat?.Conversation?.creatorId === user?.id|| currentChat?.creatorId === user?.id)&&
                      <div className="editButton" onClick={() => setIsEdited(true)} >
                        <Tooltip title="Sửa tên nhóm">

                          <Edit />
                        </Tooltip>
                      </div>}
                      <div className="removeButton" >
                        <Tooltip title="Thêm thành viên" onClick={handleAddMember}>
                          <PersonAdd />
                        </Tooltip>
                      </div>

                    </div>
                  </div>
                }


                <div className='chatBoxTop'>
                  <button onClick={handleShowMore}>Load thêm tin nhắn</button>
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

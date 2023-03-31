import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { SocketContext } from '../../utility/socket';
import { useSelector } from 'react-redux';
import { userSelector, friendSelector } from '../../redux/slices/userSlice';
import conversationApi from '../../api/conversationApi';
import { Button, TextField,  } from '@material-ui/core';
import { Add,  } from '@material-ui/icons';
import { Autocomplete } from '@mui/material';
import useQuery from '../../hooks/useQuery';
import api from '../../api/API';
import { useParams } from 'react-router-dom';
import { messengerSelector } from '../../redux/slices/messengerSlice';
import useDebounce from '../../hooks/useDebounce';
export default function Messenger() {
  // const [conversations, setConversations] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = useSelector(userSelector);
  const friends = useSelector(friendSelector);

  // const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [isAdd, setIsAdd] = useState(false)
  const [value, setValue] = useState([]);
  const fixedOptions = []

  const [title, setTitle] = useState('')
  const [page, setPage] = useState(0)

  const [isEdited, setIsEdited] = useState(false)

  const socket = useContext(SocketContext);

  const conversations = useSelector(messengerSelector);
  const { conversationId } = useParams();
  const [currentChat, setCurrentChat] = useState();
  const [textSearch, setTextSearch] = useState('')
  const debouncedValue = useDebounce(textSearch, 500);
  let { data, loading, hasMore, error } = useQuery(api.GET_CONVERSATIONS, 0, { textSearch: debouncedValue });
  let messengers = debouncedValue != '' ? data : conversations;

  useEffect(() => {
    setCurrentChat(messengers.find(item => item.id === Number(conversationId)));
  }, [conversationId])




  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on('getMessage', (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       fileUrl: data.fileUrl
  //     });
  //   });
  //   if (conversations.length > 0) setCurrentChat(conversations[0]);

  // }, []);

  // useEffect(() => {
  //   const getMessage = async () => {
  //     console.log('currentChat', currentChat);
  //     console.log('arrivalMessage', arrivalMessage);
  //     if (arrivalMessage &&
  //       currentChat.userId === arrivalMessage.sender) {
  //       const sender = await userApi.getUserById(arrivalMessage.sender)
  //       let obj = {
  //         ...arrivalMessage,
  //         createdAt: Date.now(),
  //       }
  //       obj.profilePicture = sender.profilePicture;
  //       console.log('obj', obj);
  //       setMessages((prev) => [...prev, obj]);
  //     }
  //   }
  //   getMessage()
  // }, [arrivalMessage, currentChat]);



  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await conversationApi.getOfUser();
  //       setConversations(res);
  //     } catch (err) { }
  //   };
  //   getConversations();
  // }, [user.id]);



  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);




  const handleAdd = () => {
    setIsAdd(true);
    setCurrentChat(false)
  }

  // const handleSubmit = async () => {
  //   setIsAdd(false);
  //   try {
  //     if (!currentChat) {
  //       let memberIds = value.map(member => member.followedId)
  //       let res = await conversationApi.newConversation({ users: memberIds });
  //       notify(res.message);
  //       setConversations(pre => [...pre, res.data])
  //       setCurrentChat(res.data)
  //     } else {
  //       let memberIds = value.map(member => member.followedId)
  //       let res = await conversationApi.addMember(currentChat.conversationId, { users: memberIds });
  //       notify(res.message);
  //     }
  //   } catch (error) {

  //   }
  // }


  // useEffect(() => {
  //   setConversations(data)
  // }, [data]);
  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await conversationApi.getOfUser({ params: { textSearch } })
  //       setConversations(res);
  //     } catch (error) {

  //     }
  //   }
  //   getConversations()
  // }, [textSearch]);
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
  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       if (pageMessage === 0) return;
  //       const res = await conversationApi.getMessage(
  //         currentChat?.conversationId, {
  //         params: {
  //           page: pageMessage
  //         }
  //       }
  //       );
  //       setMessages([...res.data, ...messages]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMessages();
  // }, [pageMessage])



  // const handleRename = async () => {
  //   setIsEdited(false);
  //   try {
  //     const res = await conversationApi.editConversation(currentChat.conversationId, { title });
  //     notify(res.message);
  //     conversations.forEach(c => {
  //       if (c.conversationId === res.data.id) {
  //         c.title = res.data.title;
  //         setCurrentChat(c);
  //       }
  //     })
  //     setConversations(conversations)
  //   } catch (error) {

  //   }
  // }

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
            {messengers.map((c, i) => (
              <div ref={lastBookElementRef} key={i} onClick={() => { setIsAdd(false); setCurrentChat(c); setIsEdited(false) }}>
                <Conversation conversation={c} selected={Number(conversationId) === c.id} />
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
                  {/* handleSubmit */ }
                }>
                Thêm
              </Button>
            </>
            }
          </div>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className="chatTitle">
                  {currentChat.img.length > 1 ? (
                    <div className='sidebarFriendImg'>
                      <img src={currentChat.img[0]} alt="ss" className='imageNotification2 image-1' />
                      <img src={currentChat.img[1]} alt="ss" className='imageNotification2 image-2' />
                    </div>) :
                    (<div className='sidebarFriendImg'>
                      <img src={currentChat.img[0]} alt="ss" className='imageMessenger' />
                    </div>)}
                  <span className="sidebarFriendName">{currentChat?.title}</span>
                </div>

                <Message conversation={currentChat} />
                {/* {messages.map((m) => (
                    <div key={m.id} ref={scrollRef}>
                      <Message message={m} own={m.senderId === user.id} />
                    </div>
                  ))} */}

                {/* <NewMessageForm
                  selectFile={selectFile}
                  file={file}
                  setFile={setFile}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSubmit={handleSendMessage}
                /> */}
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

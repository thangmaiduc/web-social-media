import './message.css';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
import { Tooltip } from '@material-ui/core';
import useDebounce from '../../hooks/useDebounce';
import useQuery from '../../hooks/useQuery';
import api from '../../api/API';
import { useContext, useEffect, useRef, useState } from 'react';
import { userSelector } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import NewMessageForm from '../newMessageForm/NewMessageForm';
import commonApi from '../../api/commonApi';
import conversationApi from '../../api/conversationApi';
import { SocketContext } from '../../utility/socket';
import messengerSlice from '../../redux/slices/messengerSlice';
const _ = require('lodash');
export default function Message({ conversation }) {
  const [textSearch, setTextSearch] = useState('')
  const [page, setPage] = useState(0)
  const [length, setLength] = useState(0)
  const scrollRef = useRef();
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  // const debouncedValue = useDebounce(textSearch, 500);
  // let messengers = debouncedValue != '' ? data : conversations;
  let { data, loading, hasMore, error } = useQuery(`${api.GET_MESSAGES}${conversation.id}`, page, {});
  const [messages, setMessages] = useState([])
  const user = useSelector(userSelector);
  const [newMessage, setNewMessage] = useState('');
  const socket = useContext(SocketContext);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) return;
    socket.on('getMessage', (data) => {
      setArrivalMessage(data);
    });
    // if (conversations.length > 0) setCurrentChat(conversations[0]);
  }, []);
  useEffect(() => {
    setMessages(data)
  }, [data]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {

    if (!arrivalMessage || arrivalMessage.conversationId !== conversation.id) return;
    console.log(arrivalMessage);
    setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleShowMore = () => {
    if ((page + 1) * 10 > length) return
    if ((page + 1) * 10 < length) {
      setPage(p => p + 1)
    }
  }

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

  const sendMessage = async () => {
    if (!socket) return;
    let messageCreated = {
      senderId: user.id,
      conversationId: conversation.id,
      text: newMessage,
    };

    if (file) {
      messageCreated = {
        ...messageCreated,
        fileUrl
      };
      setNewMessage('');
      setFile();
    }

    const message = await conversationApi.newMessage(messageCreated);

    dispatch(messengerSlice.actions.updateLatestMessage({
      latestMessage: {
        senderId: user.id,
        text: newMessage,
        fullNameSender: user.fullName,
      },
      id: conversation.id,
      isView: true
    }))
    socket.emit('sendMessage', message);
    setMessages(m => [...m, message])
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };


  return (
    <div className='chatBoxTop'>
      {/* <button onClick={handleShowMore}>Load thêm tin nhắn</button> */}
      <div className='wrapperItemsMessage'>
        {
          messages.map((message) => (
            <div key={message.id} ref={scrollRef}>
              {/* <Message message={m} own={m.senderId === user.id} /> */}
              <div className={message?.senderId === user.id ? 'message own' : 'message'}>
                <div className='messageTop'>
                  <Tooltip title={message?.user?.fullName || ''}>

                    <img className='messageImg' src={message?.user?.img} alt='' />
                  </Tooltip>
                  <div className='messageTopBottom'>
                    {((message?.Attachments?.length > 0 && message?.Attachments[0]) || (message.fileUrl)) && <img
                      className='messageImage'
                      src={
                        _.get(message, 'Attachments.0.fileUrl', null)
                        || _.get(message, 'fileUrl', '')
                        // ? PF + user.profilePicture
                        // : PF + "person/noAvatar.png"
                      }
                      alt=''
                    />}
                    {message.text && <p className='crop messageText'>{message.text}</p>}
                  </div>
                </div>
                <div className='messageBottom'>{format(message?.createdAt)}</div>
              </div>
            </div>
          ))
        }
      </div>
      <NewMessageForm
        selectFile={selectFile}
        file={file}
        setFile={setFile}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSubmit={handleSendMessage}
      />
    </div>

  );
  // }
}

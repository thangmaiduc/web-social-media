import './message.css';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
import { Tooltip } from '@material-ui/core';
import useDebounce from '../../hooks/useDebounce';
import useQuery from '../../hooks/useQuery';
import api from '../../api/API';
import { useContext, useEffect, useRef, useState } from 'react';
import { userSelector } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux';
import NewMessageForm from '../newMessageForm/NewMessageForm';
import commonApi from '../../api/commonApi';
import conversationApi from '../../api/conversationApi';
import { SocketContext } from '../../utility/socket';
const _ = require('lodash');
export default function Message({ conversationId }) {
  const [textSearch, setTextSearch] = useState('')
  const [page, setPage] = useState(0)
  const [length, setLength] = useState(0)
  const scrollRef = useRef();
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  // const debouncedValue = useDebounce(textSearch, 500);
  // let messengers = debouncedValue != '' ? data : conversations;
  let { data, loading, hasMore, error } = useQuery(`${api.GET_MESSAGES}${conversationId}`, page, null);
  const [messages, setMessages] = useState()
  const user = useSelector(userSelector);
  const [newMessage, setNewMessage] = useState('');
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on('getMessage', (data) => {
        // setArrivalMessage({
        //   sender: data.senderId,
        //   text: data.text,
        //   fileUrl: data.fileUrl
        // });
      });
      // if (conversations.length > 0) setCurrentChat(conversations[0]);

    }, []);
    useEffect(() => {
      setMessages(data)
    }, [data]);
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
      let messageObject = {
        senderId: user.id,
        conversationId: conversationId,
        text: newMessage,
      };
      // let objMesSocket = {
      //   senderId: user.id,
      //   receiverId: currentChat.userId,
      //   text: newMessage,
      // }
      if (file) {
        messageObject = {
          ...messageObject,
          fileUrl
        };
        setNewMessage('');
        setFile();
      }

      socket.emit('sendMessage', messageObject);
      const message = await conversationApi.newMessage(messageObject)
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
                <div className={message.senderId === user.id ? 'message own' : 'message'}>
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

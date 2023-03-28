
import { format } from 'timeago.js';
import { useSelector } from 'react-redux'

import { userSelector } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';

import "./conversation.css";

export default function Conversation({ conversation }) {
  const user = useSelector(userSelector);
  let subject, text;

  if (!!conversation.latestMessage.senderId) {
    subject = conversation.latestMessage.senderId === user.id ? 'bạn:' : `${conversation.latestMessage.fullNameSender}:`;
    subject = conversation.type === 'private' ? '' : subject;
    text = subject + ' ' + conversation.latestMessage.text
  }
  return (
    <Link to={`/messenger/${conversation.id}`} key={conversation.id} className="bodyNotification">
      {conversation?.img?.length > 1 ? (
        <div className='wrapperImageMessage'>
          <img src={conversation.img[0]} alt="ss" className='imageNotification2 image-1' />
          <img src={conversation.img[1]} alt="ss" className='imageNotification2 image-2' />
        </div>) :
        (<div className='wrapperImageMessage'>
          <img src={conversation.img[0]} alt="ss" className='imageMessenger' />
        </div>)
      }
      <div className="containerContentNotification">
        <p className="titleMesssenger cropText">{conversation.title}</p>
        <span className="contentMessage cropText">{text} </span>
        <span className='timeMessage'>{format(conversation.updatedAt)}</span>

      </div>
      {!conversation.isView &&
        <span className='tickView'></span>
      }
    </Link>
  )
}

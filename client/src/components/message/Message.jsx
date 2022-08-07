import './message.css';
import Image from '../image/Image';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
export default function Message({ message, own }) {
  if (message.type === 'file') {
    const blob = new Blob([message.body], { type: message.type });
    return (
      <div className={own ? 'message own' : 'message'}>
        <div className='messageTop'>
          <img className='messageImg' src={message.img} alt='' />
          <div>
            <Image fileName={message.fileName} blob={blob} />
          </div>
          <p className='messageText'>{message.text}</p>
        </div>
        <div className='messageBottom'>{format(message.createdAt)}</div>
      </div>
    );
  } else {
    return (
      <div className={own ? 'message own' : 'message'}>
        <div className='messageTop'>
          <img className='messageImg' src={message.img} alt='' />
          <p className='messageText'>{message.text}</p>
        </div>
        <div className='messageBottom'>{format(message.createdAt)}</div>
      </div>
    );
  }
}

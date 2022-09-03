import './message.css';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
import { Tooltip } from '@material-ui/core';
const _ = require('lodash');
export default function Message({ message, own }) {

  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <Tooltip title={message?.User?.fullName }>

          <img className='messageImg' src={message?.User?.img || message.profilePicture} alt='' />
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
  );
  // }
}

import './message.css';
import Image from '../image/Image';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
export default function Message({ message, own }) {
  // if (message.attachments && message.attachments.length > 0) {
  // const blob = new Blob([message.body], { type: message.type });
  //   return (
  //     <div className={own ? 'message own' : 'message'}>
  //       <div className='messageTop'>
  //         <img className='messageImg' src={message.img} alt='' />

  //           <img
  //             className='messageImage'
  //             src={
  //               message.attachments[0]?.fileUrl
  //               // ? PF + user.profilePicture
  //               // : PF + "person/noAvatar.png"
  //             }
  //             alt=''
  //           />
  //           {/* <Image fileName={message.fileName} blob={blob} /> */}

  //         {/* <p className='messageText'>{message.text}</p> */}
  //       </div>
  //       <div className='messageBottom'>{format(message.createdAt)}</div>
  //     </div>
  //   );
  // } else {
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <img className='messageImg' src={message?.img} alt='' />
        <div className='messageTopBottom'>
        {message?.attachments?.length>0&&message?.attachments[0] &&<img
            className='messageImage'
            src={
              message.attachments[0]?.fileUrl
              // ? PF + user.profilePicture
              // : PF + "person/noAvatar.png"
            }
            alt=''
          />}
          <p className='messageText'>{message?.text}</p>
        </div>
      </div>
      <div className='messageBottom'>{format(message?.createdAt)}</div>
    </div>
  );
  // }
}

import { Popover } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { format } from 'timeago.js';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

import WrapperPopper from '../popper/WrapperPopper';
import { messengerSelector, } from '../../redux/slices/messengerSlice';
import { userSelector } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import api from '../../api/API';
import useQuery from '../../hooks/useQuery';
import Conversation from '../conversations/Conversation';

function MessagePopper({ onClose, open, anchorEl }) {
    const user = useSelector(userSelector);
    const conversations = useSelector(messengerSelector);
    const [textSearch, setTextSearch] = useState('')
    const debouncedValue = useDebounce(textSearch, 500);
    let { data, loading, hasMore, error } = useQuery(api.GET_CONVERSATIONS, 0, debouncedValue);
    let messengers = debouncedValue != '' ? data : conversations;

    return (<Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        // transition
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformorigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
    >
        <WrapperPopper >
            <div className='wrapperNotification'>
                <span className='titleNotification'>Tin nhắn</span>
                <div className="searchMessengerWrapper">
                    <span className="logoSearch"><Search fontSize='small' /></span>
                    <input className='searchInput' type="text" placeholder='Tìm kiếm trên Messenger'
                        value={textSearch}
                        onChange={(e) => setTextSearch(e.target.value)}
                    />
                </div>
                <div className='wrapperItems'>
                    {
                        messengers.map(item => {
                            let subject, text;
                            if (!!item?.latestMessage?.senderId) {
                                subject = item.latestMessage.senderId === user.id ? 'bạn:' : `${item.latestMessage.fullNameSender}:`;
                                text = subject + ' ' + item.latestMessage.text
                            }
                            return (
                                <Conversation key={item.id} conversation={item} />
                            )
                        })
                    }
                </div>
            </div>
        </WrapperPopper >
    </Popover >);
}

export default MessagePopper;
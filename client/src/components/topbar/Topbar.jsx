
import { Search, Person, Chat, Notifications, ExitToApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Popover } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { format } from 'timeago.js';
import { HomeIcon, HomeSolidIcon, GroupUserIcon, GroupUserSolidIcon, MessengerIcon, MessengerSolidIcon } from '../icons'

import { ToastContainer } from '../../utility/toast';
import WrapperPopper from '../popper/WrapperPopper';
import userSlice, { userSelector } from '../../redux/slices/userSlice';
import notificationSlice, { notificationSelector, amountNotificationSelector, viewNotification } from '../../redux/slices/notificationSlice';
import messengerSlice, { amountConversationSelector, viewMessenger, firstMessengerSelector } from '../../redux/slices/messengerSlice';
import './topbar.css';
import { SocketContext } from '../../utility/socket';
import MessagePopper from './MessagePopper';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';

export default function Topbar() {
  const user = useSelector(userSelector);
  // const notifications
  const [textSearch, setTextSearch] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const notifications = useSelector(notificationSelector);
  const amountNotification = useSelector(amountNotificationSelector)
  const amountConversation = useSelector(amountConversationSelector)
  const firstMessengerId = useSelector(firstMessengerSelector)
  const socket = useContext(SocketContext);
  // const [notifications, setNotifications] = useState(noti)
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElMessenger, setAnchorElMessenger] = useState(null);

  useEffect(() => {
    socket.on('sendNotification', (data) => {
      dispatch(notificationSlice.actions.receiveNotification(data));
    })
    socket.on('getMessenger', (conversation) => {
      console.log('getMessenger>>>>>>>>', conversation);
      dispatch(messengerSlice.actions.updateLatestMessage({ ...conversation, isView: false }));
    })
    //   // console.log(data);
    //   // setNotifications([...notifications, data]);

    // });
    // setNotifications(useSelector(notificationSelector()))

  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('addUser', user.id);
    return () => {
      socket.close();
    }
  }, [user]);

  const logout = () => {
    dispatch(userSlice.actions.logout())
    // window.open("http://localhost:8080/api/auth/logout", "_self");

  }
  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search/${textSearch}`)
  }
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleClickNotification = async (event) => {
    setAnchorElNotification(event.currentTarget);
    await dispatch(viewNotification());

  };
  const handleClickMessenger = (event) => {
    setAnchorElMessenger(event.currentTarget);


  };
  const openNotification = Boolean(anchorElNotification);
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };
  const openMessenger = Boolean(anchorElMessenger);
  const handleCloseMessenger = async () => {
    setAnchorElMessenger(null);
    await dispatch(viewMessenger());
  };
  return (
    <div className='topbarContainer'>
      <ToastContainer autoClose={2000} pauseOnFocusLoss={false} />
      <div className='topbarLeft'>
        <Link to='/home' style={{ textDecoration: 'none' }}>
          <span className='logo'>Social Media</span>
        </Link>
        <form className='searchbar' type='submit' onSubmit={handleSearch}>
          <Search className='searchIcon' />
          <input
            placeholder='Search for friend, post or video'
            className='searchInput'
            value={textSearch}
            // type='submit'
            onChange={(e) => setTextSearch(e.target.value)}
          />
        </form>
      </div>

      <div className='topbarCenter'>
        <Menu>
          <MenuItem icon={<HomeIcon />} solidIcon={<HomeSolidIcon />} to={'/home'} />
          <MenuItem icon={<GroupUserIcon />} solidIcon={<GroupUserSolidIcon />} to={'/groups'} />
          <MenuItem icon={<MessengerIcon />} solidIcon={<MessengerSolidIcon />} to={'/messenger/'+firstMessengerId} />
        </Menu>

      </div>
      <div className='topbarRight'>

        <div className='topbarIcons'>
          <div className='topbarIconItem'>
            <Person className='logoIcon' />
            <span className='topbarIconBadge'>1</span>
          </div>
          <div className='topbarIconItem'>

            {/* <Link to='/messenger' style={{ textDecoration: 'none' }}> */}


            <Chat className='logoIcon'
              id="basic-button"
              size='small' variant="contained"
              aria-controls={openMessenger ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMessenger ? 'true' : undefined}
              onClick={handleClickMessenger}
            />
            {/* </Link> */}
            <span className='topbarIconBadge'>{amountConversation}</span>
          </div>
          <MessagePopper
            open={openMessenger}
            anchorEl={anchorElMessenger}
            onClose={handleCloseMessenger}
            notifications={notifications}
          />
          <Popover
            open={openNotification}
            anchorEl={anchorElNotification}
            onClose={handleCloseNotification}
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
                <span className='titleNotification'>Thông báo</span>
                <div className='wrapperItems'>

                  {notifications.map(item => (
                    <div key={item.id} className="bodyNotification">
                      <img src={item.img} alt="ss" className='imageNotification' />
                      <div className="containerContentNotification">
                        <p className='contentNotification'> <strong>{item.fullName} </strong>{item.content}</p>
                        <span className='timeNotification'>{format(item.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>


              </div>
            </WrapperPopper>
          </Popover>
          <div className='topbarIconItem'>
            <Notifications className='logoIcon'
              id="basic-button"
              size='small' variant="contained"
              aria-controls={openNotification ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openNotification ? 'true' : undefined}
              onClick={handleClickNotification} />
            <span className='topbarIconBadge'>{amountNotification}</span>
          </div>

        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : PF + 'person/noAvatar.png'
            }
            alt=''
            className='topbarImg'
          />
        </Link>
        <Link to={`login`}>
          < Button size='small' variant="contained"
            startIcon={<ExitToApp />} onClick={
              logout
            }>
            Đăng xuất
          </Button>
        </Link>
      </div>
    </div >
  );
}

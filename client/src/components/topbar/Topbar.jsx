
import { Search, Person, Chat, Notifications, ExitToApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Popover } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { format } from 'timeago.js';

import { ToastContainer } from '../../utility/toast';
import WrapperPopper from '../popper/WrapperPopper';
import userSlice, { userSelector } from '../../redux/slices/userSlice';
import notificationSlice, { notificationSelector, amountNotificationSelector, view } from '../../redux/slices/notificationSlice';
import './topbar.css';
import { SocketContext } from '../../utility/socket';

export default function Topbar() {
  const user = useSelector(userSelector);
  // const notifications
  const [textSearch, setTextSearch] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const notifications = useSelector(notificationSelector);
  const amountNotification = useSelector(amountNotificationSelector)
  const socket = useContext(SocketContext);
  // const [notifications, setNotifications] = useState(noti)
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationArrive, setNotificationArrive] = useState(null);

  useEffect(() => {
    socket.on('sendNotification', (data) => {
      dispatch(notificationSlice.actions.receiveNotification(data));
    })
    //   // console.log(data);
    //   // setNotifications([...notifications, data]);

    // });
    // setNotifications(useSelector(notificationSelector()))

  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('addUser', user.id);
    // return () => {
    //   socket.close();
    // }
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

  const open = Boolean(anchorEl);
  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    await dispatch(view());

  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className='topbarContainer'>
      <ToastContainer />
      <div className='topbarLeft'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <span className='logo'>Social Media</span>
        </Link>
      </div>
      <div className='topbarCenter'>


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
      <div className='topbarRight'>
        <div className='topbarLinks'>
          <span className='topbarLink'>Homepage</span>
        </div>
        <div className='topbarIcons'>
          <div className='topbarIconItem'>
            <Person className='logoIcon' />
            <span className='topbarIconBadge'>1</span>
          </div>
          <div className='topbarIconItem'>

            <Link to='/messenger' style={{ textDecoration: 'none' }}>

              <Chat className='logoIcon' />
            </Link>
            <span className='topbarIconBadge'>2</span>
          </div>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
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
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick} />
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

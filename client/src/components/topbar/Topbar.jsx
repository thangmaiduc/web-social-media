import './topbar.css';
import { Search, Person, Chat, Notifications, ExitToApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import userSlice, { userSelector } from '../../redux/slices/userSlice';
import { Link, useHistory } from 'react-router-dom';
import { ToastContainer } from '../../utility/toast';
import { Button } from '@material-ui/core';
import { useState } from 'react';
export default function Topbar() {
  const user = useSelector(userSelector);
  const [textSearch, setTextSearch] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const logout = () => {
    // localStorage.clear();
    dispatch(userSlice.actions.logout())
    window.open("http://localhost:8080/api/auth/logout", "_self");
    
  }
  const handleSearch=(e)=>{
    e.preventDefault();
    history.push(`/search/${textSearch}`)
  }
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
          <div className='topbarIconItem'>
            <Notifications className='logoIcon' />
            <span className='topbarIconBadge'>1</span>
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

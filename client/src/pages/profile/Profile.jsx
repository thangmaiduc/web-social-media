import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const res = await userApi.getUser(username);
      console.log('user', res);
      setUser(res);
    };
    fetchUser();
  }, [username]);
  return (
    <>
      <Topbar />
      <div className='profile'>
        <Sidebar />
        {user && (
          <div className='profileRight'>
            <div className='profileRightTop'>
              <div className='profileCover'>
                <img
                  className='profileCoverImg'
                  src={user.coverPicture}
                  alt=''
                />
                <img
                  className='profileUserImg'
                  src={user.profilePicture}
                  alt=''
                />
              </div>
              <div className='profileInfo'>
                <h4 className='profileInfoName'>{user.fullName}</h4>
                <span className='profileInfoDesc'>{user.description}</span>
              </div>
            </div>
            <div className='profileRightBottom'>
              <Feed username={username} />
              <Rightbar user={user} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

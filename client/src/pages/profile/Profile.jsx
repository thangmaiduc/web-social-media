import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import { Edit, EditOutlined, PhotoCamera } from '@material-ui/icons';
import { Menu, MenuItem, Tooltip } from '@material-ui/core';
import commonApi from '../../api/commonApi';
import { notify } from '../../utility/toast';
import { useSelector, useDispatch } from 'react-redux';
import userSlice, { userSelector } from '../../redux/slices/userSlice';
import { Button, Stack } from '@mui/material';
import { ChangePasswordModal } from './ChangePasswordModal';
import { EditImage } from './EditImage';
import { ProfileModal } from './ProfileModal';
// import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';

export default function Profile() {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const [isShow3, setIsShow3] = useState(false);
  const curUser = useSelector(userSelector);
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [urlFile, setUrlFile] = useState('');
  const [isCover, setIsCover] = useState(false);
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(5)
  const [length, setLength] = useState(0)
  const [editText, setEditText] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await userApi.getUser(username);
      console.log('user', res);
      setUser(res);
    };
    fetchUser();
  }, [username]);

  const handleUploadProfilePicture = async () => {
    try {
      
      
      console.log('urlFile', urlFile);
      let obj = {};
      if (isCover && urlFile !== '') obj.coverPicture = urlFile;
      else if (urlFile !== '') obj.profilePicture = urlFile
      let res = await userApi.updateUser(obj)
      console.log('res.data', res.data);
      dispatch(userSlice.actions.updateUser(obj))
      setUser(res.data);
      notify(res.message);
      setIsShow2(false)
    } catch (error) {
    } finally {
      setFile(null);
      setUrlFile('');
      setIsCover(false);
    }
  }





  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const editUser = async (fullName, description, city, country) => {
    try {
      let obj = { fullName, description, city, country };
      const res = await userApi.updateUser(obj)
      console.log('res.data', res.data);
      dispatch(userSlice.actions.updateUser(res.data))
      setUser(res.data);
      notify(res.message);
      setIsShow(false)
    } catch (error) {

    }
  }

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
                {curUser.id === user.id &&
                  <div >
                    <Tooltip title="Sửa ảnh đại diện" className="editProfilePicture" onClick={() => setIsShow2(true)}>
                      <PhotoCamera />
                    </Tooltip>
                    <Stack direction="row" spacing={2}>
                    </Stack>

                    <Button
                      id="basic-button"
                      size='small' variant="contained"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => {
                        setIsShow(true)
                        handleClose()
                      }
                      }>Sửa thông tin</MenuItem>
                      <MenuItem onClick={() => {
                        setIsShow2(true)
                        setIsCover(true)
                        handleClose()
                      }}>Sửa ảnh bìa</MenuItem>
                      <MenuItem onClick={() => {
                        setIsShow3(true)
                        handleClose()
                      }}>Đổi mật khẩu</MenuItem>
                    </Menu>
                  </div>
                }

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
      {
        isShow &&
        <ProfileModal
          setIsShow={setIsShow}
          user={user}
          editUser={editUser}
        />
      }
      {
        isShow3 &&
        <ChangePasswordModal
          setIsShow={setIsShow3}
          user={user}
          editUser={editUser}
        />
      }
      {
        isShow2 &&
        <EditImage
          setIsShow={setIsShow2}
          user={user}
          file={file}
          setFile={setFile}
          handleUploadProfilePicture={handleUploadProfilePicture}
          setUrlFile={setUrlFile}
        />
      }
    </>
  );
}

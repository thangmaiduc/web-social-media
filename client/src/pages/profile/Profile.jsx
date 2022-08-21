import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import { Edit, EditOutlined, PhotoCamera } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import commonApi from '../../api/commonApi';
import { ToastContainer, notify } from '../../utility/toast';
import { useSelector, useDispatch } from 'react-redux';
import userSlice, { userSelector } from '../../redux/slices/userSlice';
import { Button, Stack } from '@mui/material';
import { ProfileModal } from './ProfileModal';
// import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';

export default function Profile() {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
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
      const res = await userApi.updateUser(obj)
      console.log('res.data', res.data);
      dispatch(userSlice.actions.updateUser(obj))
      setUser(res.data);


      notify(res.message);
    } catch (error) {

    } finally {
      setFile('');
      setIsCover(false);
    }
  }

  const handleFileUpload = async (e) => {
    try {
      // setFile(e.target.files[0]);
      const uploadData = new FormData();
      uploadData.append('file', e.target.files[0], 'file');
      const res = await commonApi.cloudinaryUpload(uploadData);
      setUrlFile(res.secure_url);
      if (window.confirm('Bạn có muốn sửa ảnh đại diện?')) {
        handleUploadProfilePicture()
      }

    } catch (error) {
      console.log(error);
    }
  }
  const handleClick = () => {
    setIsShow(true)
  }
  const editUser =async (fullName, newPass, oldPass, description, city, country) => {
    try {
      let obj = { fullName,  description, city, country };
      const res = await userApi.updateUser(obj)
      console.log('res.data', res.data);
      dispatch(userSlice.actions.updateUser(res.data))
      setUser(res.data);
      notify(res.message);
    } catch (error) {

    }
  }

  return (
    <>
      <Topbar />
      <div className='profile'>
        <Sidebar />
        {/* <ToastContainer /> */}
        {user && (
          <div className='profileRight'>
            <div className='profileRightTop'>
              <div className='profileCover'>
                <img
                  className='profileCoverImg'
                  src={user.coverPicture}
                  alt=''
                />
                <input
                  style={{ display: 'none' }}
                  type='file'
                  id='file'
                  accept='.png,.jpeg,.jpg'
                  onChange={(e) => handleFileUpload(e)}

                />

                <img
                  className='profileUserImg'
                  src={user.profilePicture}
                  alt=''
                />
                {curUser.id === user.id &&
                  <div>


                    <label htmlFor='file' className="editProfilePicture" >
                      <Tooltip title="Sửa ảnh đại diện">

                        <PhotoCamera />
                      </Tooltip>
                    </label>
                    <Stack direction="row" spacing={2}>
                      < Button size='small' variant="contained"
                        startIcon={<Edit />} onClick={
                          handleClick
                        }>
                        Sửa thông tin
                      </Button>

                      < Button size='small' color='success' variant="contained"
                        startIcon={<PhotoCamera />} onClick={() => { setIsCover(true) }} >
                        <label htmlFor='file'  >

                          Sửa ảnh bìa
                        </label>
                      </Button>


                    </Stack>
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
      {isShow &&
        <ProfileModal
          setIsShow={setIsShow}
          user={user}
          editUser={editUser}
        />

      }
    </>
  );
}

import './share.css';
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from '@material-ui/icons';
import commonApi from '../../api/commonApi';
import postApi from '../../api/postApi';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/slices/userSlice';
import { useRef, useState } from 'react';
export default function Share() {
  const user = useSelector(userSelector);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [urlFile, setUrlFile] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      description: desc.current.value,
      img: urlFile,
    };
    console.log('newPost', newPost);
    try {
      const res = await postApi.createPost(newPost);
      console.log(res);
      window.location.reload();
    } catch (err) {}
  };
  const handleFileUpload = async (e) => {
    try {
      setFile(e.target.files[0]);
      const uploadData = new FormData();
      uploadData.append('file', e.target.files[0], 'file');
      const res = await commonApi.cloudinaryUpload(uploadData);
      setUrlFile(res.secure_url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='share'>
      <div className='shareWrapper'>
        <div className='shareTop'>
          <img className='shareProfileImg' src={user.profilePicture} alt='' />
          <input
            placeholder={"What's in your mind " + user.fullName + '?'}
            className='shareInput'
            ref={desc}
          />
        </div>
        <hr className='shareHr' />
        {file && (
          <div className='shareImgContainer'>
            <img className='shareImg' src={URL.createObjectURL(file)} alt='' />
            <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
          </div>
        )}
        <form className='shareBottom' onSubmit={submitHandler}>
          <div className='shareOptions'>
            <label htmlFor='file' className='shareOption'>
              <PermMedia htmlColor='tomato' className='shareIcon' />
              <span className='shareOptionText'>Photo or Video</span>
              <input
                style={{ display: 'none' }}
                type='file'
                id='file'
                accept='.png,.jpeg,.jpg'
                onChange={(e) => handleFileUpload(e)}
              />
            </label>
            <div className='shareOption'>
              <Label htmlColor='blue' className='shareIcon' />
              <span className='shareOptionText'>Tag</span>
            </div>
            <div className='shareOption'>
              <Room htmlColor='green' className='shareIcon' />
              <span className='shareOptionText'>Location</span>
            </div>
            <div className='shareOption'>
              <EmojiEmotions htmlColor='goldenrod' className='shareIcon' />
              <span className='shareOptionText'>Feelings</span>
            </div>
          </div>
          <button className='shareButton' type='submit'>
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";

// export default function Share() {
//   const { user } = useContext(AuthContext);
//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
//   const desc = useRef();
//   const [file, setFile] = useState(null);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const newPost = {
//       userId: user._id,
//       desc: desc.current.value,
//     };
//     if (file) {
//       const data = new FormData();
//       const fileName = Date.now() + file.name;
//       data.append("name", fileName);
//       data.append("file", file);
//       newPost.img = fileName;
//       console.log(newPost);
//       try {
//         await axios.post("/upload", data);
//       } catch (err) {}
//     }
//     try {
//       await axios.post("/posts", newPost);
//       window.location.reload();
//     } catch (err) {}
//   };
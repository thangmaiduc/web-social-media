import { Close, MoreVert, Edit } from '@material-ui/icons';
import { useEffect, useState } from "react";
import "./comment.css";
import postApi from '../../api/postApi';
import { CommentModal } from './CommentModal';

export default function Comment({ comments, handleSubmit, user }) {
  const [isShow, setIsShow] = useState(false);
  const [comment, setComment] = useState({})
  // useEffect(() => {
  //   const getFriends = async () => {
  //     const res = await axios.get("/users/friends/" + currentId);
  //     setFriends(res.data);
  //   };
  const editComment = async (e) => {
    e.preventDefault();
    try {
      // if (followed) {
      //   await userApi.unfollow(post.id)
      // } else {
      //   await userApi.follow(post.id)
      // }
      setIsShow(false)
    } catch (err) {
    }
  }
  const detailComment = (
    comments?.length > 0 && comments.map(c => (
      <div key={c.id} className="commentCenter">

        <img className='commentOwnerImg' src={c?.user?.profilePicture} alt="" />


        <div className="commentCenterBottom">
          <h4 className='commentOwner'>{c?.user?.fullName}</h4>
          <div className="commentCenterBottomRight">
            <p>{ comment.id!==c.id? c?.text: comment.text}</p>
            {user?.id === c?.userId &&
              <div className="commentOption">

                <div className="editButton" onClick={() =>{ setIsShow(true); setComment(c)}} >
                  <Edit />
                </div>
                <div className="removeButton" >
                  <Close />
                </div>
                
              </div>

            }
          </div>
        </div>




      </div>

    )
    ))
  return (
    <div className="commentWrapper">
      <div className="commentTop">
        <img className='commentImg' src="https://image-us.24h.com.vn/upload/1-2022/images/2022-03-16/baukrysie_275278910_3174792849424333_1380029197326773703_n-1647427653-670-width1440height1800.jpg" alt="" />
        <form className='formComment' onSubmit={handleSubmit}>
          <input className='commentInput' type="text" placeholder='Viết bình luận ở đây' />
          {/* <button className='sendButton'>
            Send
          </button> */}
        </form>


      </div>
      <hr className='commentHr'></hr>
      {comments?.length > 0 ? detailComment : detailComment}
      {isShow && (<CommentModal 
                  comment ={comment}
                  setComment={setComment}
                  editComment={editComment}
                  setIsShow={setIsShow}
                />)}
    </div>
  );
}

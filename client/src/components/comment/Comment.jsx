import { MoreVert } from '@material-ui/icons';
import { useEffect, useState } from "react";
import "./comment.css";
import postApi from '../../api/postApi';

export default function Comment({ comments,handleSubmit }) {

  // useEffect(() => {
  //   const getFriends = async () => {
  //     const res = await axios.get("/users/friends/" + currentId);
  //     setFriends(res.data);
  //   };
  const detailComment = (
    <div className="commentCenter">

      <img className='commentOwnerImg' src="https://image-us.24h.com.vn/upload/1-2022/images/2022-03-16/baukrysie_275278910_3174792849424333_1380029197326773703_n-1647427653-670-width1440height1800.jpg" alt="" />

      <div className="commentCenterBottom">
        <h4 className='commentOwner'>Thu Thuy</h4>
        <div className="commentCenterBottomRight">
          <p>comments</p>
          <div className="commentOption">
            <MoreVert />
          </div>

        </div>

      </div>
    </div>

  )

  return (
    <div className="commentWrapper">
      <div className="commentTop">
        <img className='commentImg' src="https://image-us.24h.com.vn/upload/1-2022/images/2022-03-16/baukrysie_275278910_3174792849424333_1380029197326773703_n-1647427653-670-width1440height1800.jpg" alt="" />
        <form className='form' onSubmit={handleSubmit}>
          <input className='commentInput' type="text" placeholder='Viết bình luận ở đây' />
          <button className='sendButton'>
            Send
          </button>
        </form>


      </div>
      <hr className='commentHr'></hr>
      {comments?.length > 0 ? detailComment : detailComment}
    </div>
  );
}

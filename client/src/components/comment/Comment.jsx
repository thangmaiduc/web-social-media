import { Close, MoreVert, Edit } from '@material-ui/icons';
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { format } from 'timeago.js';

import "./comment.css";
import postApi from '../../api/postApi';
import { CommentModal } from './CommentModal';
import { userSelector } from '../../redux/slices/userSlice';
import { notify } from '../../utility/toast';

function Comment({ comments, setComments, handleSubmit, user, handleClickShowMore, length, setLength, }) {
  // const user = useSelector(userSelector);
  const [isShow, setIsShow] = useState(false);
  const [comment, setComment] = useState({})
  const [newComment, setNewComment] = useState('')

  const editComment = async (commentId, text) => {

    try {
      const res = await postApi.editComment(commentId, { text });
      let edit = comments.find(comment => comment.id === commentId)
      edit.text = text;

      setIsShow(false)
    } catch (err) {
    }
  }
  const handleRemoveComment = async (commentId, text) => {

    try {
      const res = await postApi.deleteComment(commentId);
      notify('Xoá bình luận thành công')
      setComments(comments.filter(comment => comment.id !== commentId))
      setLength(length - 1)
    } catch (err) {
    }
  }

  const detailComment = (
    comments.map(c => (
      <div key={c.id} className="commentCenter">

        <div className='body'>
          <img className='commentOwnerImg' src={c?.user?.profilePicture} alt="" />


          <div className='commentCenterBottomWrapper'>
            <div className="commentCenterBottom">
              <h4 className='commentOwner'>{c?.user?.fullName}</h4>
              <div className="commentCenterBottomRight">
                <p className='crop'>{comment.id !== c.id ? c?.text : comment.text}</p>

                {user?.id === c?.userId &&
                  <div className="commentOption">

                    <div className="btn" onClick={() => { setIsShow(true); setComment(c) }} >


                      <Tooltip title="Sửa bình luận">

                        <Edit fontSize='small' />
                      </Tooltip>
                    </div>
                    <div className="btn" onClick={() => handleRemoveComment(c.id)} >
                      <Tooltip title="Xóa bình luận">
                        <Close fontSize='small' />
                      </Tooltip>
                    </div>

                  </div>

                }
              </div>
            </div>
          </div>
        </div>
        <div className='messageBottom commentBottom'>{format(c?.createdAt)}</div>



      </div >

    )
    ))
  return (
    <div className="commentWrapper">
      <div className="commentTop">
        <img className='commentImg' src={user?.profilePicture} alt="" />
        <input className='commentInput' type="text" placeholder='Viết bình luận ở đây' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button className="editModal" onClick={() => { handleSubmit(newComment); setNewComment('') }}> Gửi
        </button>


      </div>
      <hr className='commentHr'></hr>
      {detailComment}
      <div className='showMoreBtn' onClick={handleClickShowMore}>

        <p>Xem thêm.</p>
      </div>
      {isShow && (<CommentModal
        comment={comment}
        setComment={setComment}
        editComment={editComment}
        setIsShow={setIsShow}
      />)}
    </div>
  );
}
Comment.propTypes = {
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleClickShowMore: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
  setLength: PropTypes.func.isRequired
}

export default Comment;
import "./post.css";
import { MoreVert, PersonAddDisabled, Close, Remove, Add, Edit, Report } from "@material-ui/icons";
import { Users } from "../../dummyData";
import { useEffect, useState } from "react";
import Comment from '../comment/Comment'
import { PostModal } from './PostModal'
import postApi from '../../api/postApi';
import userSlice, { friendSelector, userSelector } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux';
import userApi from '../../api/userApi';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'timeago.js';
import { notify } from '../../utility/toast';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';

const Post = forwardRef(({ post }, ref) => {
  const user = useSelector(userSelector)
  const friends = useSelector(friendSelector)
  const [like, setLike] = useState(post.numLike || 0)
  const [comments, setComments] = useState([])
  const [isComment, setIsComment] = useState(false)
  const [option, setOption] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentPost, setCurrentPost] = useState(null);
  const [postObj, setPostObj] = useState(null);
  const [deleted, setDeleted] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [isShow, setIsShow] = useState(false);
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(5)
  const [length, setLength] = useState(0)
  const [editText, setEditText] = useState(post?.description)




  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await postApi.getComments({
          postId: currentPost,
          params: {
            page, limit
          }
        });
        setComments([...comments, ...res.data]);
        setLength(res.length);
      } catch (err) { }
    };
    if (isComment)
      getComments();
  }, [currentPost, page,]);

  useEffect(() => {
    const fetchLike = async () => {
      let res = await postApi.getLikePost(post.id);
      let usersLikeId = res.data.map(f => f.UserId)
      let check = usersLikeId.includes(user?.id)
      setIsLiked(check)
    }
    fetchLike()
  }, [user?.id, post?.id])


  const likeHandler = async () => {
    try {
      await postApi.likePost(post.id)
    } catch (error) {

    }

    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const handleComment = () => {
    setIsComment(b => !b)
    setCurrentPost(post.id)
  }
  const handleDeletePost = async () => {
    try {
      let res = await postApi.deletePost(post.id);
      if (res?.status === 204) {
        setDeleted(true)
      }
      notify('Bài viết đã xoá thành công')
    } catch (err) {

    }
  }

  const handleUnfollow = async () => {
    try {
      if (followed) {
        await userApi.unfollow(post.userId)
      } else {
        await userApi.follow(post.userId)
      }
      setFollowed(!followed);
    } catch (err) {
    }
  }
  const editPost = async (postId, editText) => {
    try {
      await postApi.editPost(postId, { description: editText });

      setIsShow(false)
    } catch (err) {
    }

  }
  const handleSubmit = async (newComment) => {
    try {
      const newCommentObj = await postApi.createComment({
        text: newComment,
        postId: post.id
      })
      setComments(c => [newCommentObj, ...c])
    } catch (error) {

    }

  }
  const handleReportPost = async () => {
    try {
      const msg = await postApi.reportPost(post.id)
      notify(msg)
    } catch (error) {

    }
  }
  const handleClickShowMore = () => {
    // if ((page + 1) * limit < length) {
    //   setLimit(p => p + 5)
    // }
    // if ((page + 1) * limit === length) {
    //   setLimit(length)
    // }
    // else {
    //   return
    // }
    if ((page + 1) * limit > length) return
    if ((page + 1) * limit < length) {
      setPage(p => p + 1)
    }
  }


  useEffect(() => {
    let friendsId = friends.map(f => f.followedId)
    let check = friendsId.includes(post?.userId)
    setFollowed(check)
  }, [post?.userId])
  // const PostDeleted =
  //   <div className="post" ref={ref}>
  //     Bài viết đã xoá
  //   </div>

  // if (deleted) return <PostDeleted  />
  return (

    <div className="post" ref={ref}>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.user.username}`} className="postTopLeft">

           
            <img
              className="postProfileImg"
              src={post.user.profilePicture}
              alt=""
            />
            <span className="postUsername">
              {post.user.fullName}
            </span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {
              post?.userId !== user.id ?
                <div className="optionButton">
                  <div className="reportButton" onClick={handleReportPost}>
                    <Tooltip title="Báo cáo bài viết">
                      <Report />
                    </Tooltip>
                  </div>
                  <button className="rightbarFollowButton" onClick={handleUnfollow}>
                    {followed ? "Unfollow" : "Follow"}
                    {followed ? <Remove fontSize='small' /> : <Add fontSize='small' />}
                  </button>
                </div> :
                <div className="optionButton">
                  <div className="removeButton" onClick={handleDeletePost}>
                    <Tooltip title="Xóa bài viết">

                      <Close fontSize='small' />
                    </Tooltip>
                  </div>
                  <div className="editButton" onClick={() => { setIsShow(true); setPostObj(post) }} >
                    <Tooltip title="Sửa bài viết">

                      <Edit fontSize='small' />
                    </Tooltip>
                  </div>
                </div>

            }


          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{editText}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="https://res.cloudinary.com/dzens2tsj/image/upload/v1660559011/like_jbx2ph.png"
              onClick={likeHandler}
              alt=""
            />

            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span onClick={handleComment} className="postCommentText">{post.numComment || 0} comments</span>
          </div>
        </div>

      </div>
      {isComment &&
        <Comment
          comments={comments}
          user={user}
          length={length}
          setPage={setPage}
          handleSubmit={handleSubmit}
          handleClickShowMore={handleClickShowMore}
          setComments={setComments}
          setLength={setLength}
        // editComment={editComment}
        />
      }
      {isShow && (<PostModal
        postObj={postObj}
        editText={editText}
        setEditText={setEditText}
        setPostObj={setPostObj}
        editPost={editPost}
        setIsShow={setIsShow}

      />)}
    </div>
  )
})
export default Post

import "./post.css";
import { MoreVert, PersonAddDisabled, Close, Remove, Add, Edit } from "@material-ui/icons";
import { Users } from "../../dummyData";
import { useEffect, useState } from "react";
import Comment from '../comment/Comment'
import { PostModal } from './PostModal'
import postApi from '../../api/postApi';
import { friendSelector, userSelector } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux';
import userApi from '../../api/userApi';
export default function Post({ post }) {
  const user = useSelector(userSelector)
  const friends = useSelector(friendSelector)
  const [like, setLike] = useState(post.numLike||0)
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

  let friendsId = friends.map(f => f.followedId)

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await postApi.getComments({
          postId: currentPost,
          params: {
            page, limit
          }
        });
        console.log('comments', res);
        setComments(res.data);
        setLength(res.length);
      } catch (err) { }
    };
    if (isComment)
      getComments();
  }, [currentPost, page, limit]);
  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const handleComment = () => {
    setIsComment(true)
    setCurrentPost(post.id)
  }
  const handleDeletePost = async () => {
    try {
      let res = await postApi.deletePost(post.id);
      if (res?.status === 204) {
        setDeleted(true)
      }
    } catch (err) {

    }
  }
  const handleUnfollow = async () => {
    try {
      if (followed) {
        await userApi.unfollow(post.id)
      } else {
        await userApi.follow(post.id)
      }
      setFollowed(!followed);
    } catch (err) {
    }
  }
  const editPost = async (e) => {
    e.preventDefault();
    try {

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

  const handleClickShowMore = () => {
    if ((page + 1) * limit < length) {
      setLimit(p => p + 5)
    }
    if ((page + 1) * limit === length) {
      setLimit(length)
    }
    else {
      return
    }
  }
  useEffect(() => {
    let check = friendsId.includes(post?.userId)
    setFollowed(check)
  }, [post?.userId])
  const PostDeleted =
    <div className="post">
      Bài viết đã xoá
    </div>

  const Post = <div className="post">
    <div className="postWrapper">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            className="postProfileImg"
            src={post.profilePicture}
            alt=""
          />
          <span className="postUsername">
            {post.fullName}
          </span>
          <span className="postDate">{post.date}</span>
        </div>
        <div className="postTopRight">
          {
            post?.userId !== user.id ?
              <button className="rightbarFollowButton" onClick={handleUnfollow}>
                {followed ? "Unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </button> :
              <div>
                <div className="removeButton" onClick={handleDeletePost}>
                  <Close />
                </div>
                <div className="editButton" onClick={() => { setIsShow(true); setCurrentPost(post.id) }} >
                  <Edit />
                </div>
              </div>

          }


        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post?.description}</span>
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
          <span onClick={handleComment} className="postCommentText">{post.numComment||0} comments</span>
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
      setPostObj={setPostObj}
      editPost={editPost}
      setIsShow={setIsShow}

    />)}
  </div>
  return (deleted ? PostDeleted : Post)
}

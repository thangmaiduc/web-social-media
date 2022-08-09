import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { Users } from "../../dummyData";
import { useEffect, useState } from "react";
import Comment from '../comment/Comment'
import postApi from '../../api/postApi';

export default function Post({ post }) {
  const [like, setLike] = useState(2)
  const [comments, setComments] = useState([])
  const [isComment, setIsComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await postApi.getComments({ postId: currentPost });
        console.log('comments', res);
        setComments(res);
      } catch (err) { }
    };
    if(currentPost && isComment)
      getComments();
  }, [currentPost]);
  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const handleComment = () => {
    setIsComment(true)
    setCurrentPost(post.id)
    console.log(currentPost);
  }

  return (
    <div className="post">
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
            <MoreVert />
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
              src="assets/like.png"
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src="assets/heart.png"
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span onClick={handleComment} className="postCommentText">{post.comment} comments</span>
          </div>
        </div>

      </div>
      {isComment &&
        <Comment
          comments = {comments}
         />
      }
    </div>
  );
}

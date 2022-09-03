import './rightbar.css';
import Online from '../online/Online';
import { friendSelector, userSelector } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Add, Remove } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';

export default function Rightbar({ user }) {
  let friendsCur = useSelector(friendSelector);
  let friendsId = friendsCur.map(f => f.followedId)
  let currentUser = useSelector(userSelector);
  const [followed, setFollowed] = useState(false);
  const [friends, setFriends] = useState(false);
  const handleClick = async () => {
  try {
      if (followed) {
        await userApi.unfollow(user.id)
      } else {
        await userApi.follow(user.id)
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };
  useEffect(() => {
    let check = friendsId.includes(user?.id)
    setFollowed(check)
  }, [user])
  useEffect(() => {
    const getFriends = async () => {
      try{
    
        const res = await userApi.getFriends(user.username);
        setFriends(res.data);
       }
       catch (err) {
       }
    }
    getFriends()
  }, [user])
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="https://res.cloudinary.com/dzens2tsj/image/upload/v1662131052/gift_ylzqt4.png" alt="" />
          <span className="birthdayText">
          <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="https://res.cloudinary.com/dzens2tsj/image/upload/v1662131032/ad_i4lplt.png" alt="" />
        
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friendsCur.map((u) => (
            <Online key={u.followedId} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.id !== currentUser.id && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          {/* <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div> */}

        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends&&friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend.username}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.fullName}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

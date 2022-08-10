import './rightbar.css';
import Online from '../online/Online';
import { friendSelector, userSelector } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Add, Remove } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import userApi from '../../api/userApi';

export default function Rightbar({ user }) {
  let friends = useSelector(friendSelector);
  let friendsId = friends.map(f => f.followedId)
  let currentUser = useSelector(userSelector);
  const [followed, setFollowed] = useState(false);
  console.log('friendsId', friendsId);
  console.log('friendsId.includes(user?.id)', friendsId.includes(user?.id));
  console.log('user', user);
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
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Online key={u.followerId} user={u} />
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
          {friends.map((friend) => (
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

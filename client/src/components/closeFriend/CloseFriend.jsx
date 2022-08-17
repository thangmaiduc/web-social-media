import { Link } from 'react-router-dom';
import "./closeFriend.css";

export default function CloseFriend({ user }) {
  return (
    <Link to={`/profile/${user.username}`}>
      <li className="sidebarFriend">
        <img className="sidebarFriendImg" src={user.profilePicture} alt="" />
        <span className="sidebarFriendName">{user.fullName}</span>
      </li>
    </Link>
  );
}

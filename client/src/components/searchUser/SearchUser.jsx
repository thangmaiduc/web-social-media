import { Add, Remove } from '@material-ui/icons';
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import userApi from '../../api/userApi';
import userSlice, { friendSelector, userSelector } from '../../redux/slices/userSlice';
import { notify } from '../../utility/toast';
export const SearchUser = ({ user }) => {
    const [followed, setFollowed] = useState(false);
    const curUser = useSelector(userSelector)
    const friends = useSelector(friendSelector)
    const dispatch = useDispatch();
    let friendsId = friends.map(f => f.followedId)
    useEffect(() => {
        let check = friendsId.includes(user?.id)
        setFollowed(check)
    }, [user?.id])
    const handleUnfollow = async () => {
        try {
            let res;
            if (followed) {
                res = await userApi.unfollow(user.id)
                dispatch(userSlice.actions.unfollow(user.id))
            } else {
                res = await userApi.follow(user.id)
                dispatch(userSlice.actions.follow({
                    followedId: user.id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    fullName: user.fullName,
                    coverPicture: user.coverPicture
                }))
            }
            notify(res.message)
            setFollowed(!followed);
        } catch (err) {
        }
    }

    return (
       
    <div className="post">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}` } className="postTopLeft">

                   
                    <img
                        className="postProfileImg"
                        src={user.profilePicture}
                        alt=""
                    />
                    <span className="postUsername">
                        {user.fullName}
                    </span>
                    </Link>
                </div>
                <div style={{ display: 'block' }} className="postTopRight">
                    <div className="optionButton">
                        {curUser.id !== user.id &&
                            <button className="rightbarFollowButton" onClick={handleUnfollow}>
                                {followed ? "Unfollow" : "Follow"}
                                {followed ? <Remove fontSize='small' /> : <Add fontSize='small' />}
                            </button>}
                    </div>
                </div>
            </div>
        </div>
    </div>

    )
}

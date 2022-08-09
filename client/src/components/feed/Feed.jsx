import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import useQuery from '../../hooks/useQuery';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/slices/userSlice';
import api from '../../api/API';

export default function Feed({ username }) {
  const user = useSelector(userSelector);
  let query;
  // if(username)
  // query = useQuery(api.GET_POST_PROFILE);
  // else
  const url = !username
    ? api.GET_POST_TIMELINE
    : api.GET_POST_PROFILE + username;
  let { data, loading, error } = useQuery(url);
  console.log(url);
  if (loading) {
    return <p>Loading...</p>;
  }
  console.log(data, loading);
  return (
    <div className='feed'>
      <div className='feedWrapper'>
        {(!username || username === user.username) && <Share />}
        {data && data.map((p) => <Post key={p.id} post={p} />)}
      </div>
    </div>
    
  );
}
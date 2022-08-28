import Post from '../post/Post';
import Share from '../share/Share';
import './searchFeed.css';
import useQuery from '../../hooks/useQuery';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/slices/userSlice';
import api from '../../api/API';
import React, { useState, useRef, useCallback, useEffect } from 'react'
import usePostSearch from '../../hooks/usePostSearch'
import { Stack } from '@mui/system';
import { Add, Remove } from '@material-ui/icons';
import { SearchUser } from '../searchUser/SearchUser';

export default function SearchFeed({ searchText }) {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageUser, setPageUser] = useState(0)
  const [pagePost, setPagePost] = useState(0)
  const user = useSelector(userSelector);
  const [lengthUser, setLengthUser] = useState(0)
  const [lengthPost, setLengthPost] = useState(0)
  // const {
  //   data,
  //   hasMore,
  //   loading,
  //   error
  // } = usePostSearch(query, page)


  let usersQuery = useQuery(api.QUERY_USERS, pageUser, searchText,);
  let postsQuery = useQuery(api.QUERY_POSTS, pagePost, searchText,);

  console.log('postsQuery', postsQuery);
  const handleClickShowMore1 = () => {
    console.log(lengthUser);
    if ((pageUser + 1) * limit > lengthUser) return
    if ((pageUser + 1) * limit < lengthUser) {
      setPageUser(p => p + 1)
    }
  }
  const handleClickShowMore2 = () => {

    if ((pagePost + 1) * limit > lengthPost) return
    if ((pagePost + 1) * limit < lengthPost) {
      setPagePost(p => p + 1)
    }
  }
  useEffect(() => {
    setLengthUser(usersQuery.length)
  }, [usersQuery])
  useEffect(() => {
    setLengthPost(postsQuery.length)
  }, [postsQuery])
  return (
    <div className='feed'>
      <div className='feedWrapper'>
        <div className="userWrapepr">
          {usersQuery.data.map((u, index) => {
            return <SearchUser
              user={u}
              key={index}
            />
          })}
          {
            lengthUser === 0 ?
              <p>{`Không có người dùng nào có từ khóa '${searchText}'`}</p> :


              <div className='showMoreBtn' onClick={handleClickShowMore1}>

                <p>Xem thêm người dùng.</p>
              </div>}
        </div>
        <div className="postWrapepr">
          {postsQuery.data.map((p, index) => {
            return <Post key={index} post={p} />
          })}

          {
            lengthPost === 0 ?
              <p>{`Không có bài viết nào có từ khóa '${searchText}'`}</p> :


              <div className='showMoreBtn' onClick={handleClickShowMore2}>

                <p>Xem thêm bài viết.</p>
              </div>}
        </div>

      </div>
    </div>

  );
}

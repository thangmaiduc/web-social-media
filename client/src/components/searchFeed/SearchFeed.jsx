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
import userApi from '../../api/userApi';

export default function SearchFeed({ searchText }) {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [pageUser, setPageUser] = useState(0)
  const [pagePost, setPagePost] = useState(0)
  const user = useSelector(userSelector);
  const [lengthUser, setLengthUser] = useState(0)
  const [lengthPost, setLengthPost] = useState(0)
  const [userSearch, setUserSearch] = useState([])
  const [postSearch, setPostSearch] = useState([])
  // const {
  //   data,
  //   hasMore,
  //   loading,
  //   error
  // } = usePostSearch(query, page)
  // useEffect(()=>{
  //   const fetchUser= async()=>{
  //     try {
  //       const res = await userApi.queryUsers({params:{
  //         page: pageUser,
  //         textSearch: searchText
  //       }})
  //       if(pageUser>0)
  //       setUserSearch([...userSearch,...res.data])
  //       else setUserSearch([...res.data])
  //       setLengthUser(res.length)
  //     } catch (error) {
        
  //     }
  //   }
  //   fetchUser()
  // },[searchText, pageUser])
 


  let usersQuery = useQuery(api.QUERY_USERS, pageUser, searchText,);
  let postsQuery = useQuery(api.QUERY_POSTS, pagePost, searchText,);

  const handleClickShowMore1 = () => {
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
    setUserSearch(usersQuery.data)
    
    setLengthUser(usersQuery.length)

  }, [usersQuery])
  useEffect(() => {
    setPostSearch(postsQuery.data)
    
    setLengthPost(postsQuery.length)

  }, [postsQuery])

  useEffect(() => { 
    if (lengthUser === 0) setUserSearch([])
  },[lengthUser])
  useEffect(() => { 
    if (lengthPost=== 0) setPostSearch([])
  },[lengthPost])
  return (
    <div className='feed'>
      <div className='feedWrapper'>
        <div className="userWrapepr">
          {userSearch.map((u, index) => {
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
          {postSearch.map((p, index) => {
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

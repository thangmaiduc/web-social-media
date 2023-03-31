import { useSelector } from 'react-redux';
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import useQuery from '../../hooks/useQuery';
import { userSelector } from '../../redux/slices/userSlice';
import api from '../../api/API';


export default function Feed({ username, isShare = true, groupId }) {
  const [page, setPage] = useState(0)
  const user = useSelector(userSelector);
  const location = useLocation();
  // const {
  //   data,
  //   hasMore,
  //   loading,
  //   error
  // } = usePostSearch(query, page)

  let url = !username
    ? api.GET_POST_TIMELINE
    : api.GET_POST_PROFILE + username;
  if (location.pathname.includes('group')) {
    url = api.GET_POSTS_GROUP;
  }
  let { data, loading, hasMore, error } = useQuery(url, page, {
    groupId
  });
  const observer = useRef()

  useEffect(() => {
    setPage(0);
    return () => {
    }
  }, [groupId])


  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  return (
    <div className='feed'>
      <div className='feedWrapper'>
        {((!username || username === user.username) && isShare) && <Share />}
        {data.map((p, index) => {
          if (data.length === index + 1) {
            return <Post ref={lastBookElementRef} key={p.id} post={p} username={username} />
          } else {
            return <Post key={p.id} post={p} username={username} />
          }
        })}

      </div>
    </div>

  );
}

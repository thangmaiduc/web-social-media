import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import useQuery from '../../hooks/useQuery';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/slices/userSlice';
import api from '../../api/API';
import React, { useState, useRef, useCallback, useEffect } from 'react'
import usePostSearch from '../../hooks/usePostSearch'

export default function Feed({ username }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const user = useSelector(userSelector);
  // const {
  //   data,
  //   hasMore,
  //   loading,
  //   error
  // } = usePostSearch(query, page)

  const url = !username
    ? api.GET_POST_TIMELINE
    : api.GET_POST_PROFILE + username;
  let { data, loading, hasMore, error } = useQuery(url, page, query);
  const observer = useRef()

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
        {(!username || username === user.username) && <Share />}
        {data.map((p, index) => {
          if (data.length === index + 1) {
            return <Post ref={lastBookElementRef} key={index} post={p} />
          } else {
            return <Post key={index} post={p} />
          }
        })}

      </div>
    </div>

  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import postApi from '../api/postApi';

export default function usePostsearch(query, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  // useEffect(() => {
  //   const getPosts = async () => {
  //     try {
  //       setLoading(true);
  //       setError(false);
  //       let res = await postApi.getTimeLine({page});
  //       setPosts(res.data)
  //       setHasMore(res.data.length > 0);
  //       setLoading(false);
  //     } catch (e) {
  //       setError(true);
  //     }
  //   };
  //   getPosts();
  // }, [query, page]);
  // useEffect(() => {
  //   setPosts([]);
  // }, [query]);

  // useEffect(() => {
  //   setLoading(true)
  //   setError(false)
  //   let cancel
  //   axios({
  //     method: 'GET',
  //     url: 'http://openlibrary.org/search.json',
  //     params: { q: query, page: pageNumber },
  //     cancelToken: new axios.CancelToken(c => cancel = c)
  //   }).then(res => {
  //     setPosts(prevPosts => {
  //       return [...new Set([...prevPosts, ...res.data.docs.map(b => b.title)])]
  //     })
  //     setHasMore(res.data.docs.length > 0)
  //     setLoading(false)
  //   }).catch(e => {
  //     if (axios.isCancel(e)) return
  //     setError(true)
  //   })
  //   return () => cancel()
  // }, [query, pageNumber])
  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        setError(false);
        let res = await postApi.getTimeLine({ page });
        setPosts([...new Set([...data, ...res.data])]);
        setHasMore(res.data.length > 0);
        setLoading(false);
      } catch (e) {
        setError(true);
      }
    };
    getPosts();
  }, [query, page]);

  return { loading, error, data, hasMore };
}

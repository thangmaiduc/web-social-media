import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

export default function useQuery(url, page, textSearch) {
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const handleError = (error) => {
    setError(error.response?.data.err);
    setLoading(false);
  };
  const handleSuccess = (res) => {
    const newData = [...res.data];
    setData(newData);
    setHasMore(res.data.length > 0);
    setLoading(false);
  };
  // this function is calling useCallback to stop an infinite loop since it is in the dependency array of useEffect
  const runQuery = useCallback(() => {
    setLoading(true);
    axiosClient
      .get(url, {
        params: {
          page,
          textSearch,
        },
      })
      .then(handleSuccess)
      .catch(handleError);
  }, [url, page, textSearch]);

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

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return { data, loading, error, hasMore, refetch: runQuery };
}

import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import _ from 'lodash';

export default function useQuery(url, page, textSearch) {
  const [data, setData] = useState([]);
  const [length, setLength] = useState(0);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const handleError = (error) => {
    setError(error.response?.data.err);
    setLoading(false);
  };
  const handleSuccess = (res) => {
    // const newData = [...data, ...res.data];
    if (page > 0) setData([...data, ...res.data]);
    else setData([...res.data]);
    // setData(newData);
    setLength(res.length);
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
  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return { data, loading, error, hasMore, refetch: runQuery, length };
}

import { useEffect, useState } from "react";
import axiosInstance from "./axiosConfig";

const useInstanceData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(url);
        const result = await res.data;
        setData(result);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, key]);

  const refetch = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return { data, loading, error, refetch };
};

export default useInstanceData;

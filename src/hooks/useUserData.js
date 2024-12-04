import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axiosInstance.get(`/auth/user/${userId}`);
          setUserData(response.data);
          setError(null);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;

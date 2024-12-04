import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useUserData from "../../hooks/useUserData";

const SectionHeading = ({ onSearch }) => {
  const { userData, loading, error } = useUserData();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [userRole, setUserRole] = useState("");
  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/");
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Không thể tải danh sách tỉnh.");
    }
  };

  useEffect(() => {
    if (userData) {
      setUserRole(userData.role);
    }
  }, [userData]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [pickupLocation, dropoffLocation, weight]);

  useEffect(() => {
    handleSearch();
  }, [pickupLocation, dropoffLocation]);

  const handleSearch = async () => {
    if (userRole === "personal" || userRole === "business") {
      const weightValue = parseInt(weight, 10);
      if (weight && (isNaN(weightValue) || weightValue <= 0)) {
        toast.error("Vui lòng nhập khối lượng hợp lệ.");
        return;
      }

      if (!pickupLocation && !dropoffLocation && !weight) {
        try {
          const response = await axios.get(
            "http://https://xetai-be.vercel.app/posts/"
          );
          console.log("Response from /posts:", response.data);
          onSearch(response.data.salePosts || []);
        } catch (error) {
          toast.error("Lỗi khi tải danh sách bài đăng.");
        }
        return;
      }

      try {
        const response = await axios.get(
          "http://https://xetai-be.vercel.app/search",
          {
            params: {
              startPointCity: pickupLocation,
              destinationCity: dropoffLocation,
              load: weight,
            },
          }
        );
        console.log("Response from /search:", response.data);
        onSearch(response.data.posts);
      } catch (error) {
        console.error("Error searching posts:", error);
        toast.error("Lỗi khi tìm kiếm bài đăng.");
      }
    } else if (userRole === "customer") {
      if (!pickupLocation && !dropoffLocation) {
        try {
          const response = await axios.get(
            "http://https://xetai-be.vercel.app/driverpost/"
          );
          console.log("Response from /driverpost:", response.data);
          onSearch(response.data || []);
        } catch (error) {
          console.error("Error loading posts:", error);
          toast.error("Lỗi khi tải danh sách bài đăng.");
        }
        return;
      }

      try {
        const response = await axios.get(
          "http://https://xetai-be.vercel.app/search/driver-post",
          {
            params: {
              startCity: pickupLocation,
              destinationCity: dropoffLocation,
            },
          }
        );
        console.log("Response from /search/driver-post:", response.data);
        onSearch(response.data.posts);
      } catch (error) {
        console.error("Error searching posts:", error);
        toast.error("Lỗi khi tìm kiếm bài đăng.");
      }
    }
  };

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickupLocation(value);

    if (value) {
      const filteredProvinces = provinces.filter((province) =>
        province.name.toLowerCase().includes(value.toLowerCase())
      );
      setPickupSuggestions(filteredProvinces);
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDropoffChange = (e) => {
    const value = e.target.value;
    setDropoffLocation(value);

    if (value) {
      const filteredProvinces = provinces.filter((province) =>
        province.name.toLowerCase().includes(value.toLowerCase())
      );
      setDropoffSuggestions(filteredProvinces);
    } else {
      setDropoffSuggestions([]);
    }
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleSuggestionClick = (value, type) => {
    if (type === "pickup") {
      setPickupLocation(value);
      setPickupSuggestions([]);
    } else {
      setDropoffLocation(value);
      setDropoffSuggestions([]);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="search_bar">
          <h2>Tìm kiếm dịch vụ vận tải</h2>
          <div className="search_inputs">
            <div className="search_input_container">
              <input
                type="text"
                value={pickupLocation}
                onChange={handlePickupChange}
                placeholder="Địa điểm lấy hàng"
                className="search_input"
              />
              {pickupSuggestions.length > 0 && (
                <ul className="suggestions_list">
                  {pickupSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSuggestionClick(suggestion.name, "pickup")
                      }
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="search_input_container">
              <input
                type="text"
                value={dropoffLocation}
                onChange={handleDropoffChange}
                placeholder="Địa điểm trả hàng"
                className="search_input"
              />
              {dropoffSuggestions.length > 0 && (
                <ul className="suggestions_list">
                  {dropoffSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSuggestionClick(suggestion.name, "dropoff")
                      }
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {userRole !== "customer" && (
              <div className="search_input_container">
                <input
                  type="number"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="Khối lượng (kg)"
                  className="search_input"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;

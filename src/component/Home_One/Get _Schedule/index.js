import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbTransfer } from "react-icons/tb";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import { toast } from "react-toastify";

const GetSchedule = () => {
  const [provinces, setProvinces] = useState(null);
  const [startPoint, setStartPoint] = useState("");
  const [destination, setDestination] = useState("");
  const history = useHistory();

  const getProvinces = async () => {
    try {
      const result = await axios.get(
        "https://provinces.open-api.vn/api/?depth=1"
      );

      const transformedData = result.data.map((item) => ({
        value: item.code,
        label: item.name,
      }));

      setProvinces(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      width: "380px",
      boxShadow: "none",
      border: "1px solid hsl(0, 0%, 80%)",
      height: 45,
      minHeight: 45,
      ":hover": {
        borderColor: "#EC0101",
      },
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: 45,
      padding: "0 12px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: 0,
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: 45,
    }),
  };

  const onSearch = async (event) => {
    event.preventDefault();

    if (!startPoint.length || !destination.length) {
      toast.info("Vui lòng chọn điểm xuất phát và điểm đến!");
      return;
    }

    history.push(
      `/service?startPoint=${startPoint}&destination=${destination}`
    );
  };

  useEffect(() => {
    getProvinces();
  }, []);

  // if (!provinces) {
  //   return <div>Loading...</div>
  // }

  return (
    <>
      <section id="schedule_one">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-center">
                <div className="search-overlay-form">
                  <div className="mb-5 heading-left-border">
                    <h2>Tra đơn hàng</h2>
                  </div>

                  <form id="home-search-input">
                    <div>
                      <Select
                        options={provinces}
                        styles={colourStyles}
                        placeholder="Chọn tỉnh/Thành phố"
                        onChange={(data) => {
                          setStartPoint(data.label);
                        }}
                      />
                    </div>

                    <TbTransfer size={25} />

                    <Select
                      options={provinces}
                      styles={colourStyles}
                      placeholder="Chọn tỉnh/Thành phố"
                      onChange={(data) => {
                        setDestination(data.label);
                      }}
                    />

                    <div>
                      <button type="submit" onClick={onSearch}>
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetSchedule;

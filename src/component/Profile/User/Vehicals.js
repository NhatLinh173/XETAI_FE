import { useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosConfig";
import dayjs from "dayjs";

const Vehicals = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [vehicals, setVehicals] = useState([]);
  const driverId = localStorage.getItem("driverId");
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const currentPageItems = vehicals.slice(offset, offset + itemPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const selectedName = useMemo(() => {
    const findedItem = vehicals.find((item) => item._id === selectedId);
    if (!findedItem) return "";

    return findedItem.nameCar;
  }, [selectedId]);

  const onConfirmDelete = (event, selectedId) => {
    event.preventDefault();
    setSelectedId(selectedId);
    setIsVisible(true);
  };

  const onCloseModal = () => {
    setIsVisible(false);
  };

  const onDelete = async () => {
    try {
      await axiosInstance.delete(`/car/${selectedId}`);
      setIsVisible(false);
      toast.success(`Xóa thành công ${selectedName}`);
      getMyVehicals();
    } catch (error) {
      toast.success("Có lỗi xảy ra");
    }
  };

  const getMyVehicals = async () => {
    try {
      const response = await axiosInstance.get(
        `/car/driver/${driverId}/status`
      );
      setVehicals(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyVehicals();
  }, []);

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between">
        <h2>Xe của tôi</h2>

        <Link to="/vehical/add" className="btn btn-theme">
          Thêm xe mới
        </Link>
      </div>

      {currentPageItems.map((item) => (
        <div key={item._id} className="my-4 border rounded-12 item-card">
          <Link
            to={`vehical/detail/${item._id}`}
            relative="path"
            className="link-wrapper"
          >
            <div className="p-3 d-flex">
              <img
                src={
                  item.imageCar.length
                    ? item.imageCar[0]
                    : "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
                }
                alt={item.nameCar}
                className="rounded-12 cursor-pointer"
                style={{ width: "310px", height: "160px", objectFit: "cover" }}
              />

              <div className="ml-3">
                <h4 className="mb-4 fw-700 font-weight-bold">{item.nameCar}</h4>

                <div className="d-flex align-items-center custom-spacing">
                  <p className="mb-0 col-form-label font-weight-bold mr-2">
                    Biển số:
                  </p>
                  <span className="align-middle">{item.licensePlate}</span>
                </div>

                <div className="d-flex align-items-center custom-spacing">
                  <p className="mb-0 col-form-label font-weight-bold mr-2">
                    Trọng tải:
                  </p>
                  <span className="align-middle">{item.load} KG</span>
                </div>

                <div className="d-flex align-items-center custom-spacing">
                  <p className="mb-0 col-form-label font-weight-bold mr-2">
                    Ngày đăng kiểm:
                  </p>
                  <span className="align-middle">
                    {dayjs(item.registrationDate).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  justifySelf: "right",
                  textAlign: "end",
                }}
              >
                <button
                  className="btn-danger btn-sm align-self-start border-0"
                  onClick={(event) => onConfirmDelete(event, item._id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}

      <ReactPaginate
        pageCount={Math.ceil(vehicals.length / itemPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        previousLabel={"<<"}
        nextLabel={">>"}
      />

      {isVisible && (
        <div
          className="modal fade show bg-dark bg-opacity-75"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Xác nhận xóa
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={onCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa xe {selectedName} không?</p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={onCloseModal}
                >
                  Đóng
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicals;

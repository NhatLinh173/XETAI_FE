import dayjs from "dayjs";

const VehicalForm = ({ data, editable, setData }) => {
  const onFileChange = (event, field) => {
    setData((prev) => ({
      ...prev,
      [field]: event.target.files[0],
    }));
  };

  const PLACEHOLDER_IMAGE =
    "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

  const createImageUrl = (imageFile) => {
    return URL.createObjectURL(imageFile);
  };

  const getImageUrl = (data) => {
    if (typeof data === "string" && data.length > 0) {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      return createImageUrl(data);
    }

    return PLACEHOLDER_IMAGE;
  };

  return (
    <>
      <div className="pb-2 row">
        <div className="col">
          <div className="mb-2 font-weight-bold">Hình ảnh xe</div>

          <img
            className="rounded-12 border"
            src={getImageUrl(data.imageCar)}
            alt={data.name}
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          />

          {editable && (
            <div className="mt-3 d-flex justify-content-center">
              <label
                htmlFor="imageCar"
                className="btn btn-danger btn-custom mx-1 d-flex align-items-center"
              >
                Chọn ảnh
              </label>

              <input
                id="imageCar"
                className="mt-3 form-control"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => onFileChange(event, "imageCar")}
              />
            </div>
          )}
        </div>

        <div className="col">
          <div className="mb-2 font-weight-bold">Giấy tờ đăng kiểm</div>

          <img
            className="rounded-12 border"
            src={getImageUrl(data.imageRegistration)}
            alt={data.name}
            style={{ height: "300px", width: "100%", objectFit: "cover" }}
          />

          {editable && (
            <div className="mt-3 d-flex justify-content-center">
              <label
                htmlFor="imageRegistration"
                className="btn btn-danger btn-custom mx-1 d-flex align-items-center"
              >
                Chọn ảnh
              </label>

              <input
                id="imageRegistration"
                className="mt-3 form-control"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => onFileChange(event, "imageRegistration")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="row pt-3 border-top">
        <div className="col">
          <label htmlFor="name" className="required">
            Tên xe
          </label>

          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Tên xe"
            disabled={!editable}
            value={data.nameCar}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                nameCar: e.target.value,
              }))
            }
          />
        </div>

        <div className="col">
          <label htmlFor="licensePlateNumber" className="required">
            Biển số
          </label>

          <input
            id="licensePlateNumber"
            type="text"
            className="form-control"
            placeholder="Biển số"
            disabled={!editable}
            value={data.licensePlate}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                licensePlate: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <label htmlFor="deliver_address" className="required">
            Ngày đăng kiểm
          </label>

          <div>
            <input
              className="form-select rounded w-full form-control"
              type="date"
              disabled={!editable}
              value={dayjs(data.registrationDate).format("YYYY-MM-DD")}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  registrationDate: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="col">
          <label htmlFor="weightCapacity" className="required">
            Ngày hết hạn
          </label>

          <div>
            <input
              className="form-select rounded w-full form-control"
              type="date"
              disabled={!editable}
              value={dayjs(data.expirationDate).format("YYYY-MM-DD")}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  expirationDate: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <label htmlFor="weightCapacity" className="required">
            Trọng tải (Kg)
          </label>

          <input
            id="weightCapacity"
            type="number"
            className="form-control"
            placeholder="Trọng tải (Kg)"
            disabled={!editable}
            value={data.load}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                load: e.target.value,
              }))
            }
          />
        </div>

        <div className="col"></div>
      </div>
    </>
  );
};

export default VehicalForm;

import { useEffect, useState } from "react"
import VehicalForm from "./VehicalForm"
import axiosInstance from "../../../config/axiosConfig"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { toast } from "react-toastify"

const VehicalDetail = () => {
  const { id } = useParams()

  const [editable, setEditable] = useState(false)
  const [vehical, setVehical] = useState(null)
  const [defaultVehical, setDefaultVehical] = useState(null)
  const [loading, setLoading] = useState(false)

  // TODO: handle error case when call api
  const handleSubmit = async () => {
    const formData = new FormData()

    const { imageCar, imageRegistration, ...withoutImageData } = vehical

    Object.keys(withoutImageData).forEach((key) => {
      formData.append(key, withoutImageData[key])
    })

    if (typeof imageCar === "object" && !Array.isArray(imageCar)) {
      formData.append("imageCar", imageCar)
    }

    if (
      typeof imageRegistration === "object" &&
      !Array.isArray(imageRegistration)
    ) {
      formData.append("imageRegistration", imageRegistration)
    }

    setLoading(true)

    await axiosInstance.put(`/car/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    setLoading(false)

    setEditable(false)
    toast.success("Cập nhật thành công.")
  }

  const getVehicalDetail = async () => {
    try {
      const response = await axiosInstance.get(`/car/${id}`)

      const transformedData = {
        ...response.data,
        imageCar: response.data.imageCar[0],
        imageRegistration: response.data.imageRegistration[0],
      }

      setVehical(transformedData)
      setDefaultVehical(transformedData)
    } catch (error) {}
  }

  useEffect(() => {
    getVehicalDetail()
  }, [])

  if (!vehical || !defaultVehical)
    return (
      <div className="wrapper container text-center font-weight-bold">
        Không có data
      </div>
    )

  return (
    <div className="wrapper container pb-5">
      <div className="col">
        <h2 className="mb-3">Chi tiết xe: {defaultVehical.nameCar}</h2>

        <div className="border rounded-12 p-3">
          <div className="d-flex justify-content-center gap-3 flex-column">
            <VehicalForm
              editable={editable}
              data={vehical}
              setData={setVehical}
            />

            <div className="mt-4 d-flex justify-content-center gap-3">
              <button
                type="button"
                class={`btn ${editable ? "shadow-sm" : "btn-theme"}`}
                disabled={loading}
                onClick={() => {
                  setEditable((prev) => !prev)
                  setVehical(defaultVehical)
                }}
              >
                {editable ? "Quay lại" : "Chỉnh sửa"}
              </button>

              {editable && (
                <button
                  type="button"
                  class="btn btn-theme"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Đang tải..." : "Xác nhận"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicalDetail

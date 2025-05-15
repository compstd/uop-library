import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Modal() {
  const { cnic } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    id: "",
    fname: "",
    lname: "",
    father: "",
    program: "",
    semester: "",
    cnic: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    type: "",
    status: "approved",
    issueDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/students/${cnic}`, {
          withCredentials: true,
        });

        setValues((prevValues) => ({
          ...prevValues,
          id: res.data.std_id,
          fname: res.data.first_name,
          lname: res.data.last_name,
          father: res.data.father_name,
          program: res.data.program,
          semester: res.data.semester,
          cnic: res.data.cnic,
          email: res.data.email,
          phone: res.data.phone,
          dob: res.data.expirey_date,
          address: res.data.address,
          type: res.data.type,
          status: res.data.status || "pending",
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cnic]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/students/update/${values.id}`,
        values
      );
      navigate("/admin");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="d-flex bg-primary vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleUpdate}>
          <h4 className="text-center mb-3">Update Student</h4>
          <div className="row">
            {Object.entries(values).map(([key, value]) => {
              if (key === "id" || key === "issueDate") return null;

              return (
                <div className="mb-1 col-md-6 mt-2" key={key}>
                  <label htmlFor={key}>
                    {key === "dob"
                      ? "Card Expiry Date"
                      : key.replace(/([A-Z])/g, " $1")}
                  </label>
                  {key === "status" ? (
                    <select
                      className="form-control"
                      value={value}
                      onChange={(e) =>
                        setValues({ ...values, [key]: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                  ) : (
                    <input
                      type={key === "dob" ? "date" : "text"}
                      className="form-control"
                      value={value}
                      onChange={(e) =>
                        setValues({ ...values, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button type="submit" className="btn btn-secondary">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;

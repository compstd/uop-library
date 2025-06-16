import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

function ExpiredCard() {
  const [students, setStudents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    fetchStudents();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/expiredcards`);
    setStudents(response.data);
    if (response.data.length < limit) {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Error fetching students with expired cards:", error);
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure to delete it?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/students/delete/${id}`);
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.std_id !== id)
    );
  } catch (error) {
    console.error("Error deleting student:", error);
  }
};

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: " #060717", color: "white" }}
    >
      <div className="row ">
        <div className="col-4 col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 border-start border-dark">
          <div className="row">
            <div className="col-md-8">
              <div className="mb-2 mt-5">
                <input
                  type="text"
                  className="form-control "
                  placeholder="Search By Cnic"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>
          <table className="table caption-top table-dark table-hover rounded mt-2">
            <caption className="text-white fs-4">Expired Cards</caption>
            <thead>
              <tr>
                <th scope="col">Serial No</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Cnic No</th>
                <th scope="col">Type</th>
                <th scope="col">Validate</th>
                <th scope="col">Authorization</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <h5 className="mt-4">No expired cards yet</h5>
              ) : (
                students
                  .filter((item) =>
                    searchValue === "" ? true : item.cnic.includes(searchValue)
                  )
                  .map((student) => (
                    <tr key={student.Id}>
                      <td>{student.std_id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.cnic}</td>
                      <td>{student.type}</td>
                      <td>
                        <Link to={`/SignForm/${student.cnic}`}>
                          <button className="btn btn-primary">Form</button>
                        </Link>
                      </td>
                      <td>
                        <Link to={`/StudentCard/${student.cnic}`}>
                          <button className="btn btn-warning">
                            {student.status === "pending"
                              ? "pending"
                              : "registered"}
                          </button>
                        </Link>
                      </td>
                      <td>
                        <Link to={`/Update/${student.cnic}`}>
                          <button className="btn btn-success">Edit</button>
                        </Link>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(student.std_id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpiredCard;

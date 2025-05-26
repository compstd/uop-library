import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

function Student() {
  const [students, setStudents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 5;

  useEffect(() => {
    setStudents([]);
    setPage(0);
    setHasMore(true);
    fetchStudents(0);
  }, []);

  const fetchStudents = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/students?offset=${
          currentPage * limit
        }&limit=${limit}`
      );
      setStudents(response.data);
      if (response.data.length < limit) {
        setHasMore(false);
      } else {
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMoreData = async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(
        `http://localhost:4000/students?offset=${page * limit}&limit=${limit}`
      );
      setStudents((prevData) => [...prevData, ...response.data]);
      if (response.data.length < limit) {
        setHasMore(false);
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more students:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete it?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/students/delete/${id}`);
      setStudents(students.filter((student) => student.std_id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <InfiniteScroll
      dataLength={students.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>} // Better loader message
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      } // Message when no more data
    >
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
              <caption className="text-white fs-4">Pending Cards</caption>
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
                {students
                  .filter((item) =>
                    searchValue === "" ? true : item.cnic.includes(searchValue)
                  )
                  .map((student) => (
                    <tr key={student.std_id}>
                      {" "}
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
}

export default Student;

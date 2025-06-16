import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

function ThesisView() {
  const [theses, setTheses] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const limit = 5;

  useEffect(() => {
    fetchTheses();
  }, []);

 const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchTheses = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/thesis-submissions?offset=${page * limit}&limit=${limit}`
    );
    setTheses(response.data);
    if (response.data.length < limit) {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Error fetching theses:", error);
  }
};

const fetchMoreData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/thesis-submissions?offset=${page * limit}&limit=${limit}`
    );
    setTheses((prevData) => [...prevData, ...response.data]);
    if (response.data.length < limit) {
      setHasMore(false);
    }
    setPage((prevPage) => prevPage + 1);
  } catch (error) {
    console.error("Error fetching more theses:", error);
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure to delete this thesis?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/thesis-submissions/${id}`);
    setTheses((prev) => prev.filter((thesis) => thesis.id !== id));
  } catch (error) {
    console.error("Error deleting thesis:", error);
  }
};

const handleDownload = async (id, title) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/thesis-submissions/download/${id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading thesis:", error);
    alert("Error downloading thesis");
  }
};

const handleExcelDownload = async () => {
  setIsDownloading(true);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/thesis-submissions/download`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `thesis_submissions_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading excel:", error);
    alert("Error downloading excel file");
  } finally {
    setIsDownloading(false);
  }
};

  return (
    <InfiniteScroll
      dataLength={theses.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader="loading...."
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
                <div className="mb-2 mt-5 d-flex">
                  <input
                    type="text"
                    className="input-sm"
                    placeholder="Search By Title"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button
                    className="btn btn-success mx-3"
                    onClick={handleExcelDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Downloading...
                      </>
                    ) : (
                      "Download Excel"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <table className="table caption-top table-dark table-hover rounded mt-2">
              <caption className="text-white fs-4">Thesis Submissions</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Title</th>
                  <th scope="col">Department</th>
                  <th scope="col">Degree</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {theses
                  .filter((item) =>
                    searchValue === ""
                      ? true
                      : item.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                  )
                  .map((thesis) => (
                    <tr key={thesis.id}>
                      <td>{thesis.id}</td>
                      <td>{`${thesis.first_name} ${thesis.last_name}`}</td>
                      <td>{thesis.phone}</td>
                      <td>{thesis.title}</td>
                      <td>{thesis.department}</td>
                      <td>{thesis.degree}</td>
                      <td>
                        <Link to={`/thesis/edit/${thesis.id}`}>
                          <button className="btn btn-success">Edit</button>
                        </Link>
                        &nbsp;
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleDownload(thesis.id, thesis.title)
                          }
                        >
                          Download
                        </button>
                        &nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(thesis.id)}
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

export default ThesisView;

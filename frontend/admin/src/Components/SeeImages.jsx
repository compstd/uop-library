import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";

function SeeImages() {
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("http://localhost:4000/images");
        const data = await response.json();
        setEventData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/deleteImage/${id}`);
      setEventData((prevData) => prevData.filter((data) => data.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 "
      style={{ backgroundColor: " #060717", color: "white" }}
    >
      <div className="row ">
        <div className="col-4 col-md-2 vh-100">
          <Sidebar />
        </div>
        <div className="col-8 col-md-10 border-start border-dark">
          <Header />
          {EventData.length === 0 ? (
            <h4 className="text-center mt-5">No record found</h4>
          ) : (
            <table className="table caption-top table-dark table-hover rounded mt-2">
              <caption className="text-white fs-4">Events</caption>
              <thead>
                <tr>
                  <th scope="col">Serial No</th>
                  <th scope="col">Image</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {EventData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>
                      {data.name ? (
                        <img
                          src={`http://localhost:4000/uploads/${data.name}`}
                          alt={data.name}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(data.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeeImages;

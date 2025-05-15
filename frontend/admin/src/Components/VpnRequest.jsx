import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
function VpnRequest() {
  const [VpnData, setVpnData] = useState([]);

  useEffect(() => {
    fetchVpnData();
  }, []);

  const fetchVpnData = async () => {
    const response = await axios.get("http://localhost:4000/resources/vpn");
    setVpnData(response.data);
    console.log(response.data);
  };

  // const handledelete = (id) => {
  //   try {
  //     axios.delete('http://localhost:4000/delete/' + id).then((res) => {
  //       navigate('/')
  //     })
  //   } catch (error) {
  //     console.error('Error deleting data:', error)
  //   }
  // }
  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: " #060717", color: "white" }}
    >
      <div className="row ">
        <div className="col-4 col-md-2">
          <Sidebar />
        </div>
        <div className="col-8 col-md-10 border-start border-dark">
          <Header />
          <table className="table caption-top table-dark table-hover rounded mt-2">
            <caption className="text-white fs-4">VPN Request</caption>
            <thead>
              <tr>
                <th scope="col">Serial No</th> <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Department</th> <th scope="col">Reg.No</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Form</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
              {VpnData.map((data) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.fname}</td>
                  <td>{data.lname}</td>
                  <td>{data.department}</td>
                  <td>{data.registration}</td>
                  <td>{data.email}</td>
                  <td>{data.phone}</td>
                  <td>
                    <Link to={`/VpnForm/${data.registration}`}>
                      <button className="btn btn-warning">Form</button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/Update/${data.id}`}>
                      <button className="btn btn-success">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VpnRequest;

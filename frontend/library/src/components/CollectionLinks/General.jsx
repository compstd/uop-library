import { useEffect } from "react";
import axios from "axios";
import { Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";

export default function General() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await axios.post(
          `${API_BASE_URL}/api/test-connection`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Backend Connection Successful:", response.data);
      } catch (error) {
        console.error("Backend Connection Failed:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <Col md={8} sm={12} className="collection">
      <p>
        Since the Central library is blessed with rich, evergreen, and latest
        collection that surely lives up to the reputation. Due to regular
        acquainting, accessible services and the frequently organized workshops
        and seminars have pulled the attentions of every knowledge seeker. No
        doubt, no library is self-reliant in the information explosion era, but
        the central library contains nearly all the needed resources to keep
        every user interested. The following statistics will better illustrate
        the success of central library. The following statistics will better
        illustrate the success of central library.
      </p>
      <p>
        <strong>
          <span>Library General Collection</span>
        </strong>
      </p>
      <Table striped responsive className="border">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Print Resources</th>
            <th>Total No Of Collection</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td>Books </td>
            <td>1,92,548 Volumes</td>
          </tr>
          <tr>
            <td>02</td>
            <td>Subscribe Journals</td>
            <td>30</td>
          </tr>
          <tr>
            <td>03</td>
            <td>Subscribe Newspapers</td>
            <td>21</td>
          </tr>
          <tr>
            <td>04</td>
            <td>Journal received through exchange</td>
            <td>633</td>
          </tr>
          <tr>
            <td>05</td>
            <td>Research publication (thesis & Dissertation)</td>
            <td>22656</td>
          </tr>
          <tr>
            <td>06</td>
            <td>Master Theses</td>
            <td>16759</td>
          </tr>
          <tr>
            <td>07</td>
            <td>MPhil Theses</td>
            <td>3929</td>
          </tr>
          <tr>
            <td>08</td>
            <td>PhD Theses</td>
            <td>2968</td>
          </tr>
        </tbody>
      </Table>
    </Col>
  );
}

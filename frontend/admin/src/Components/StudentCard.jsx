import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CardFront from './CardFront'
function StudentCard() {
  const [students, setStudents] = useState([])
  const { cnic } = useParams()

  const API_BASE_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  const fetchData = async () => {
    try {
      const studentResponse = await axios.get(
        `${API_BASE_URL}/students/${cnic}`
      );
      setStudents(studentResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [cnic]);

useEffect(() => {
  const updateStatus = async () => {
    try {
      await axios.put(`${API_BASE_URL}/students/${cnic}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  updateStatus();
}, [cnic]);


  return (
    <div className='container-fluid'>
      <div className='row'>
        <CardFront students={students} />
      </div>
    </div>
  )
}

export default StudentCard

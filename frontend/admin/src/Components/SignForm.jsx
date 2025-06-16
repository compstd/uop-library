import StudentForm from "./StudentForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const SignForm = () => {
  const [students, setStudents] = useState([]);
  const { cnic } = useParams();

const API_BASE_URL = "https://library-backend-q8p3.onrender.com";

useEffect(() => {
  const controller = new AbortController(); 
  const { signal } = controller;

  const fetchData = async () => {
    try {
      const studentResponse = await axios.get(
        `${API_BASE_URL}/students/${cnic}`,
        { signal }
      );
      setStudents(studentResponse.data);
      console.log(`Student data fetched successfully for CNIC: ${cnic}`);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Fetch request canceled:", error.message);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  fetchData();

  return () => {
    controller.abort(); // cleanup on unmount
  };
}, [cnic]);

  return <StudentForm students={students} />;
};

export default SignForm;

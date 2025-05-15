import StudentForm from "./StudentForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const SignForm = () => {
  const [students, setStudents] = useState([]);
  const { cnic } = useParams();

  const controller = new AbortController();

  const signal = controller.signal;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `http://localhost:4000/students/${cnic}`,
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
      controller.abort();
    };
  }, [cnic]);

  return <StudentForm students={students} />;
};

export default SignForm;

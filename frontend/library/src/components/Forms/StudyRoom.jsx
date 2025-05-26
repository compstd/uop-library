import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SuccessModal from "./SuccessModal";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = yup
  .object({
    fname: yup
      .string()
      .required("Missing first Name")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    lname: yup
      .string()
      .required("Missing last Name")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    regNo: yup
      .string()
      .required("Missing Registration No")
      .matches(/^[a-zA-Z0-9-]+$/, "Registration No type invalid"),
    email: yup
      .string()
      .required("Missing Email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email Format"
      ),
    phone: yup
      .string()
      .required("Missing Phone No")
      .matches(/^\d+$/, "Invalid Phone No"),
    title: yup
      .string()
      .required("Missing Thesis Title")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    stdId: yup
      .string()
      .required("Missing Student Id")
      .matches(/^\d+$/, "Invalid Phone No"),
    scholar: yup
      .string()
      .required("Missing Scholar")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    supervisor: yup
      .string()
      .required("Missing supervisor name")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    degree: yup
      .string()
      .required("Missing degree type")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    department: yup
      .string()
      .required("Missing department Name")
      .matches(/^[^0-9][a-zA-Z0-9\s]*$/, "String Type Invalid"),
    year: yup
      .string()
      .required("Missing Year")
      .matches(
        /^\d{4}-\d{4}$/,
        "Year must be in YYYY-YYYY format (e.g., 2023-2024)"
      ),
  })
  .required();

export default function StudyRoom() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const Input = ({ placeholder, register, errors, label, format }) => {
    return (
      <Col sm={12} lg={6} md={6}>
        <Form.Group className="mb-3 input-group-lg">
          <Form.Label>{label}</Form.Label>
          <Form.Control {...register()} type="text" placeholder={placeholder} />
          {errors && <span className="text-danger">{errors.message}</span>}
          <Form.Text muted>{format}</Form.Text>
        </Form.Group>
      </Col>
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/thesis-submissions/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );
      setIsModalVisible(true);
    } catch (error) {
      console.error("Submission error:", error);

      if (error.code === "ECONNABORTED") {
        alert("The request timed out. Please try again.");
      } else {
        alert(
          error.response?.data?.error ||
            "An error occurred while submitting the thesis."
        );
      }
    }
  };

  return (
    <>
      <h4 className="mb-5" style={{ marginTop: "19px" }}>
        Thesis Submission Form
      </h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-2">
          <Input
            label="First Name *"
            register={() => register("fname")}
            errors={errors.fname}
          />
          <Input
            label="Last Name *"
            register={() => register("lname")}
            errors={errors.lastname}
          />
          <Input
            label="Registration No *"
            register={() => register("regNo")}
            errors={errors.regNo}
            format="student RegNo"
          />
          <Input
            label="Email *"
            register={() => register("email")}
            errors={errors.email}
            format="example@gmail.com"
          />
          <Input
            label="Phone *"
            register={() => register("phone")}
            errors={errors.phone}
            format="00001234567"
          />
          <Input
            label="Thesis Title *"
            register={() => register("title")}
            errors={errors.title}
          />
          <Input
            label="Student ID *"
            register={() => register("stdId")}
            errors={errors.stdId}
            format="00"
          />
          <Input
            label="Scholar Name *"
            register={() => register("scholar")}
            errors={errors.scholar}
          />
          <Input
            label="Supervisor Name *"
            register={() => register("supervisor")}
            errors={errors.supervisor}
          />
          <Input
            label="Degree *"
            register={() => register("degree")}
            errors={errors.degree}
          />
          <Input
            label="Department Name *"
            register={() => register("department")}
            errors={errors.department}
          />
          <Input
            label="Year *"
            register={() => register("year")}
            errors={errors.year}
            format="YYYY-YYYY (e.g., 2023-2024)"
          />
          <Col sm={12} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Upload Thesis (PDF only)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col md={3}>
            <button
              className="btn form-control"
              style={{
                color: "#fff",
                borderColor: "#0a1551",
                backgroundColor: "#0a1551",
              }}
              type="submit"
            >
              Submit
            </button>
          </Col>
        </Row>
      </Form>
      <SuccessModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onNavigate={() => navigate("/")}
      />
    </>
  );
}

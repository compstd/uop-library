import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setError(null); // Clear any previous errors
    console.log("Selected file:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError("Please select an image file");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    
    try {
      console.log("Uploading to:", `${API_BASE_URL}/events/img`);
      
      const response = await axios.post(`${API_BASE_URL}/events/img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Upload response:", response.data);
      alert("Image uploaded successfully!");
      navigate("/");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      
      // Better error handling
      if (error.response) {
        setError(`Server error: ${error.response.data.error || error.response.data}`);
      } else if (error.request) {
        setError("Network error: Unable to reach server");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex bg-secondary vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h4 className="text-center mb-3">Add Images</h4>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="imageInput" className="form-label">Home image</label>
            <input
              id="imageInput"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-secondary mt-3"
            disabled={loading || !image}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUpload;

import { Col } from "react-bootstrap";
import "./Map.css";

export default function MapSection() {
  return (
    <Col md={6} sm={12} className="map-section">
      <div className="map-responsive">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.63995299127!2d71.48486267484121!3d34.001780720394656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d9172f1013deb3%3A0xf48e2b845c74392d!2sCentral%20Library%2C%20University%20of%20Peshawar!5e0!3m2!1sen!2s!4v1747331331763!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </Col>
  );
}

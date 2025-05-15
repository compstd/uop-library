import { Container, Row, Col } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import tahir from "../images/tahir.jpg";
import section from "../images/section.jpg";
import vice from "../images/vice.jpg";
import head from "../images/head.jpg";
import "./Staff.css";
import { Link } from "react-router-dom";

const staff = [
  {
    id: 1,
    name: "Sir Habib",
    pic: head,
  },
  {
    id: 2,
    name: "Sir Tahir",
    pic: tahir,
  },
  {
    id: 3,
    name: "Sir Aslam",
    pic: vice,
  },
];

export default function Staff() {
  return (
    <Col md={9}>
      <Container className="about-section section-padding">
        <Row className="mb-4">
          <Col sm={12} lg={4}>
            <img src={head} className="about-image" alt="admin" />
          </Col>
          <Col
            className="rounded"
            style={{ backgroundColor: "aliceblue" }}
            md={7}
            sm={12}
            lg={5}
          >
            <div className="custom-text-block">
              <h2 className="mb-0">Sir Habib</h2>
              <p className="text-muted mb-lg-2 mb-md-2">Founding Partner</p>

              <p>
                Lorem Ipsum dolor sit amet, consectetur adipsicing kengan omeg
                kohm tokito Professional charity theme based
              </p>

              <p>
                Sed leo nisl, posuere at molestie ac, suscipit auctor mauris.
                Etiam quis metus
              </p>
              <div className="social-icons">
                <span>
                  <Link className="rounded-circle">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </Link>
                </span>
                <span>
                  <Link className="rounded-circle">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Link>
                </span>
                <span>
                  <Link className="rounded-circle">
                    <FontAwesomeIcon icon={faGithub} />
                  </Link>
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          {staff.map((staff) => (
            <Col xs={12} md={4} lg={4} key={staff.id}>
              <StaffItem pic={staff.pic} name={staff.name} />
            </Col>
          ))}
        </Row>
      </Container>
    </Col>
  );
}

function StaffItem({ name, pic }) {
  return (
    <Card className="staff-card bg-light mb-3">
      <Card.Img src={pic} alt="Staff Photo" loading="lazy" />
      <Card.Body className="text-center">
        <h3>{name}</h3>
        <div className="social-icons">
          <span>
            <Link className="rounded-circle">
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </span>
          <span>
            <Link className="rounded-circle">
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
          </span>
          <span>
            <Link className="rounded-circle">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}

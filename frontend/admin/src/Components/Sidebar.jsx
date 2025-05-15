import { Link } from "react-router-dom";
import "./styles.css";

function Sidebar() {
  return (
    <div className="sidebar-bg sidebar p-2">
      <div className="m-2">
        <i className="bi bi-person-fill me-3 fs-4"></i>
        <span className="brand-name fs-4">Admin</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <Link className="list-group-item py-2" to="/">
          <i className="bi bi-speedometer2 fs-5 me-3"></i>
          <span>Dashboard</span>
        </Link>
        <Link className="list-group-item py-2 " to="/">
          <i className="bi bi-house fs-5 me-3"></i> <span>Home</span>
        </Link>
        <Link className="list-group-item py-2" to="/Student">
          <span>Pending Cards</span>
        </Link>
        <Link className="list-group-item py-2" to="/Compstd">
          <span>Completed Cards</span>
        </Link>
        <Link className="list-group-item py-2" to="/ExpiredCard">
          <span>Expired Cards</span>
        </Link>
        <Link className="list-group-item py-2" to="/thesis">
          <i className="bi bi-table fs-5 me-3"></i> <span>Thesis</span>
        </Link>
        <Link className="list-group-item py-2" to="/VpnRequest">
          <i className="bi bi-people fs-5 me-3"></i> <span>VPN Request</span>
        </Link>
        <Link className="list-group-item py-2" to="/WifiRequest">
          <i className="bi bi-people fs-5 me-3"></i> <span>Wifi Request</span>
        </Link>
        <Link className="list-group-item py-2" to="/Events">
          <i className="bi bi-people fs-5 me-3"></i> <span>Events</span>
        </Link>
        <Link className="list-group-item py-2" to="/AddEvent">
          <i className="bi bi-people fs-5 me-3"></i> <span>Add Events</span>
        </Link>
        <Link className="list-group-item py-2" to="/Imageupload">
          <i className="bi bi-people fs-5 me-3"></i> <span>Add Images</span>
        </Link>
        <Link className="list-group-item py-2" to="/Images">
          <i className="bi bi-people fs-5 me-3"></i> <span>Delete Images</span>
        </Link>
        <Link className="list-group-item py-2" to="/Message">
          <i className="bi bi-people fs-5 me-3"></i> <span>Messages</span>
        </Link>
        <a className="list-group-item py-2" href="/Login">
          <i className="bi bi-power fs-5 me-3"></i> <span>LogOut</span>
        </a>
        <a className="list-group-item py-2" href="/Registration">
          <i className="bi bi-power fs-5 me-3"></i> <span>Registration</span>
        </a>
      </div>
    </div>
  );
}
export default Sidebar;

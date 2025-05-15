import React, { useEffect, useState } from "react";
import "./Home.css";
import Nav from "./Nav";

function Home({ Toggle }) {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    totalThesis: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await fetch(
          "http://localhost:4000/api/dashboard-data"
        );
        const studentsData = await studentsResponse.json();

        const thesisResponse = await fetch(
          "http://localhost:4000/api/thesis-dashboard-data"
        );
        const thesisData = await thesisResponse.json();

        setDashboardData({
          ...studentsData,
          totalThesis: thesisData.totalThesis,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="px-3">
      <Nav Toggle={Toggle} />
      <div className="container-fluid">
        <div className="row g-3 my-2">
          <div className="col-md-3 p-1">
            <div className="p-3 delivery shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{dashboardData.totalStudents}</h3>
                <p className="fs-5">Students Cards</p>
              </div>
              <i className="bi bi-truck p-3 fs-1"></i>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 sales shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{dashboardData.totalRevenue}</h3>
                <p className="fs-5">Total Revenue</p>
              </div>
              <i className="bi bi-currency-dollar p-3 fs-1"></i>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 products shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{dashboardData.totalThesis}</h3>
                <p className="fs-5">Thesis Submitted</p>
              </div>
              <i className="bi bi-cart-plus p-3 fs-1"></i>
            </div>
          </div>

          <div className="col-md-3 p-1">
            <div className="p-3 stock shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">20%</h3>
                <p className="fs-5">Increase</p>
              </div>
              <i className="bi bi-graph-up-arrow p-3 fs-1"></i>
            </div>
          </div>
        </div>
        <div className="row g-3 my-2">
          <div className="col-md-3 p-1">
            <div className="p-3 products shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">230</h3> <p className="fs-5">Products</p>
              </div>
              <i className="bi bi-cart-plus p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-md-3 p-1">
            <div className="p-3 sales shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">2450</h3> <p className="fs-5">Sales</p>
              </div>
              <i className="bi bi-currency-dollar p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-md-3 p-1">
            <div className="p-3 stock shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">20%</h3> <p className="fs-5">Increase</p>
              </div>
              <i className="bi bi-graph-up-arrow p-3 fs-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

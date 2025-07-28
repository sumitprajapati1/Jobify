import React, { useContext, useEffect, useState } from "react";
import "./EmployerDashboard.css";
import { Context } from "../../main";
import axios from "axios";
import { API_BASE_URL } from "../../config";
// import { useNavigate } from "react-router-dom";
import PostJob from "../Job/PostJob";
import MyJobs from "../Job/MyJobs";
import MyApplications from "../Application/MyApplications";
import Jobs from "../Job/Jobs";
import { useNavigate } from "react-router-dom";

const EmployerDashboard = () => {
  const { user, isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  // const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employer jobs
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/v1/job/getmyjobs`,
          { withCredentials: true }
        );
        setJobs(data.myJobs || []);
      } catch (error) {
        setJobs([]);
      }
    };
    // Fetch employer applications
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/v1/application/employer/getall`,
          { withCredentials: true }
        );
        setApplications(data.applications || []);
      } catch (error) {
        setApplications([]);
      }
    };
    fetchJobs();
    fetchApplications();
  }, []);

  // Dashboard stats
  const activeJobs = jobs.filter((job) => !job.expired).length;
  const totalApplications = applications.length;
  // Jobs Views and Interviews Scheduled are not available from API, so set to 0 or N/A
  const jobsViews = 0; // No API for this
  const interviewsScheduled = 0; // No API for this

  // Sidebar navigation handlers
  // const handleNav = (path) => {
  //   navigate(path);
  // };

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      setIsAuthorized(false);
      setUser({});
      navigate("/login");
    } catch (error) {
      setIsAuthorized(false);
      setUser({});
      navigate("/login");
    }
  };

  // Card content for each panel
  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-label">Active Jobs</div>
                <div className="stat-value">{activeJobs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">{totalApplications}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Jobs Views</div>
                <div className="stat-value">{jobsViews}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Interviews Scheduled</div>
                <div className="stat-value">{interviewsScheduled}</div>
              </div>
            </div>
            <div className="dashboard-lists">
              <div className="recent-jobs">
                <h3>Recent Job Postings</h3>
                {jobs.length === 0 ? (
                  <p>No jobs posted yet.</p>
                ) : (
                  jobs.slice(0, 10).map((job) => (
                    <div className="job-card" key={job._id}>
                      <div className="job-title-row">
                        <span className="job-title">{job.title}</span>
                        <span className={`job-status ${job.expired ? "" : "active"}`}>{job.expired ? "Expired" : "Active"}</span>
                      </div>
                      <div className="job-details-row">
                        <span>{job.country || "-"}</span>
                        <span>
                          {job.fixedSalary
                            ? `$${job.fixedSalary}`
                            : job.salaryFrom && job.salaryTo
                            ? `$${job.salaryFrom} - $${job.salaryTo}`
                            : "-"}
                        </span>
                        <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}</span>
                      </div>
                      <div className="job-meta-row">
                        <span>{applications.filter(app => app.jobId === job._id).length} applications</span>
                        {/* No views data */}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="recent-applications">
                <h3>Recent Applications</h3>
                {applications.length === 0 ? (
                  <p>No applications yet.</p>
                ) : (
                  applications.slice(0, 10).map((app) => (
                    <div className="application-card" key={app._id}>
                      <div className="applicant-row">
                        <span className="applicant-name">{app.name}</span>
                      </div>
                      <div className="application-details">{app.jobTitle || "-"}</div>
                      <div className="application-meta">{app.experience ? `${app.experience} years experience` : ""} {app.createdAt ? `• ${new Date(app.createdAt).toLocaleString()}` : ""}</div>
                      <div className="application-actions">
                        <button className="view-profile-btn">View Profile</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
      case "postJob":
        return (
          <div className="dashboard-card-panel">
            <PostJob />
          </div>
        );
      case "viewJobs":
        return (
          <div className="dashboard-card-panel">
            <MyJobs />
          </div>
        );
      case "applications":
        return (
          <div className="dashboard-card-panel">
            <MyApplications />
          </div>
        );
      case "allJobs":
        return (
          <div className="dashboard-card-panel">
            <Jobs />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="employer-dashboard-container">
      <header className="employer-dashboard-header">
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and track applications.</p>
        <button
          className="post-job-btn"
          onClick={() => setActivePanel("postJob")}
        >
          Post New Job
        </button>
      </header>
      <div className="employer-dashboard-main">
        <aside className="employer-dashboard-sidebar">
          <div className="profile-card">
            <div className="profile-icon">🏢</div>
            <h2>{user?.name || "Company Name"}</h2>
            <p>{user?.email || "company@email.com"}</p>
            <button
              className="edit-profile-btn"
              // onClick={() => handleNav("/profile")}
              disabled
            >
              Edit Company Profile
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activePanel === "dashboard" ? "active" : ""}
                onClick={() => setActivePanel("dashboard")}
              >
                Dashboard
              </li>
              <li
                className={activePanel === "postJob" ? "active" : ""}
                onClick={() => setActivePanel("postJob")}
              >
                Post New Job
              </li>
              <li
                className={activePanel === "viewJobs" ? "active" : ""}
                onClick={() => setActivePanel("viewJobs")}
              >
                View Jobs
              </li>
              <li
                className={activePanel === "applications" ? "active" : ""}
                onClick={() => setActivePanel("applications")}
              >
                Applications
              </li>
              <li
                className={activePanel === "allJobs" ? "active" : ""}
                onClick={() => setActivePanel("allJobs")}
              >
                All Jobs
              </li>
              <li onClick={handleLogout} style={{ color: "#e74c3c", fontWeight: 600, cursor: "pointer" }}>
                Logout
              </li>
            </ul>
          </nav>
        </aside>
        <section className="employer-dashboard-content">
          {renderPanel()}
        </section>
      </div>
    </div>
  );
};

export default EmployerDashboard; 
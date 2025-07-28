import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobSeekerDashboard.css";
import MyApplications from "../Application/MyApplications";
import Jobs from "./Jobs";
import JobDetails from "./JobDetails";
import Application from "../Application/Application";
import { API_BASE_URL } from "../../config";

const JobSeekerDashboard = () => {
  const { user, isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "job Seeker")) {
      navigate("/login");
      return;
    }
    axios
      .get(`${API_BASE_URL}/v1/application/jobseeker/getall`, {
        withCredentials: true,
      })
      .then((res) => {
        setApplications(res.data.applications || []);
      })
      .catch(() => setApplications([]));
    axios
      .get(`${API_BASE_URL}/v1/job/getall`, {
        withCredentials: true,
      })
      .then((res) => {
        setJobs(res.data.jobs || []);
      })
      .catch(() => setJobs([]));
  }, [isAuthorized, user, navigate]);

  // Stats
  const stats = {
    jobsApplied: applications.length,
    profileViews: 0, // Not available
    savedJobs: 0, // Not available
    interviews: 0, // Not available
  };

  // Recent applications: show up to 10 most recent
  const recentApplications = applications.slice(0, 10);
  // Recommended jobs: show up to 10 jobs
  const recommendedJobs = jobs.slice(0, 10);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
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

  // Panel rendering
  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-label">Jobs Applied</div>
                <div className="stat-value">{stats.jobsApplied}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Profile Views</div>
                <div className="stat-value">{stats.profileViews}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Saved Jobs</div>
                <div className="stat-value">{stats.savedJobs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Interviews</div>
                <div className="stat-value">{stats.interviews}</div>
              </div>
            </div>
            <div className="dashboard-lists">
              <div className="recent-applications">
                <h3>Recent Applications</h3>
                {recentApplications.length === 0 ? (
                  <p>No recent applications found.</p>
                ) : (
                  recentApplications.map((app, idx) => (
                    <div className="application-card" key={app._id || idx}>
                      <div className="applicant-row">
                        <span className="applicant-name">{app.jobTitle || "Applied Job"}</span>
                        <span className="application-status new">{app.status || "Submitted"}</span>
                      </div>
                      <div className="application-details">{app.company || "-"}</div>
                      <div className="application-meta">
                        {app.createdAt ? new Date(app.createdAt).toLocaleString() : "-"}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="recent-jobs">
                <h3>Recommended for You</h3>
                {recommendedJobs.length === 0 ? (
                  <p>No jobs found.</p>
                ) : (
                  recommendedJobs.map((job, idx) => (
                    <div className="job-card" key={job._id || idx}>
                      <div className="job-title-row" style={{cursor:'pointer'}} onClick={() => {setActivePanel('jobDetails'); setSelectedJobId(job._id);}}>
                        <span className="job-title">{job.title}</span>
                        <span className="job-status active">Active</span>
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
                        <span>{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : "-"}</span>
                      </div>
                      <div className="job-meta-row">
                        <button className="js-apply-btn" onClick={() => {setActivePanel('application'); setSelectedApplicationId(job._id);}}>Apply Now</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
      case "applications":
        return <MyApplications />;
      case "allJobs":
        return <JobsPanel onJobClick={(id) => {setActivePanel('jobDetails'); setSelectedJobId(id);}} onApplyClick={(id) => {setActivePanel('application'); setSelectedApplicationId(id);}} />;
      case "jobDetails":
        return <JobDetailsPanel jobId={selectedJobId} onApplyClick={(id) => {setActivePanel('application'); setSelectedApplicationId(id);}} />;
      case "application":
        return <ApplicationPanel jobId={selectedApplicationId} />;
      default:
        return null;
    }
  };

  // JobsPanel: wrapper for Jobs with job click/apply click
  const JobsPanel = ({ onJobClick, onApplyClick }) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
      axios.get(`${API_BASE_URL}/v1/job/getall`, { withCredentials: true })
        .then(res => setJobs(res.data.jobs || []))
        .catch(() => setJobs([]));
    }, []);
    return (
      <div className="recent-jobs">
        <h3>All Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-title-row" style={{cursor:'pointer'}} onClick={() => onJobClick(job._id)}>
                <span className="job-title">{job.title}</span>
                <span className="job-status active">Active</span>
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
                <span>{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : "-"}</span>
              </div>
              <div className="job-meta-row">
                <button className="js-apply-btn" onClick={() => onApplyClick(job._id)}>Apply Now</button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // JobDetailsPanel: wrapper for JobDetails with jobId prop
  const JobDetailsPanel = ({ jobId, onApplyClick }) => {
    if (!jobId) return <div>Select a job to view details.</div>;
    return <JobDetails jobId={jobId} onApplyClick={onApplyClick} />;
  };

  // ApplicationPanel: wrapper for Application with jobId prop
  const ApplicationPanel = ({ jobId }) => {
    if (!jobId) return <div>Select a job to apply.</div>;
    return <Application jobId={jobId} />;
  };

  return (
    <div className="employer-dashboard-container">
      <header className="employer-dashboard-header">
        <h1>Welcome, {user?.name || "Job Seeker"}!</h1>
        <p>Here's what's happening with your job search today.</p>
        <button
          className="post-job-btn"
          onClick={() => setActivePanel("allJobs")}
        >
          Find New Jobs
        </button>
      </header>
      <div className="employer-dashboard-main">
        <aside className="employer-dashboard-sidebar">
          <div className="profile-card">
            <div className="profile-icon">👤</div>
            <h2>{user?.name || "Job Seeker"}</h2>
            <p>{user?.email || "-"}</p>
            <button
              className="edit-profile-btn"
              disabled
            >
              Edit Profile
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
                className={activePanel === "allJobs" ? "active" : ""}
                onClick={() => setActivePanel("allJobs")}
              >
                Search Jobs
              </li>
              <li
                className={activePanel === "applications" ? "active" : ""}
                onClick={() => setActivePanel("applications")}
              >
                My Applications
              </li>
              <li
                onClick={handleLogout}
                style={{ color: "#e74c3c", fontWeight: 600, cursor: "pointer" }}
              >
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

export default JobSeekerDashboard; 
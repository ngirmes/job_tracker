import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  async function getJobs() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/jobs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    console.log(data);
    setJobs(data);
  }

  return (
    <>
      <button onClick={getJobs}>Get Jobs</button>
      <div>
        {jobs.map((job) => (
          <div key={job.id}>
            <h3>{job.company}</h3>
            <p>{job.role}</p>
            <p>{job.status}</p>
          </div>
        ))}
      </div>
    </>

    // display jobs
  );
}

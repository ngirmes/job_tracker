import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<any[]>([]);
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [dateApplied, setDateApplied] = useState("")
  const navigate = useNavigate();

  useEffect( () => {
    getJobs()}, [page])

  async function getJobs() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/jobs?page=${page}&limit=3`, {
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

  async function postJob() {
    const token = localStorage.getItem("token")
  
    const res = await fetch(`http://localhost:3000/jobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          company,
          role,
          status,
          dateApplied,
        }),
      });

      const data = await res.json()

      if (res.ok) {
        console.log('Job posted succesfully', data)
      }
      else {
        console.error(data.error)
        console.log('where am I')
      }

  }

  return (
    <>
      <>
        <button onClick={getJobs}>Get Jobs</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
        <button disabled={page===1} onClick={() => setPage(page - 1)}>Previous</button>
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

      <form onSubmit={postJob} className="p-8 max-w-md mx-auto">
        <input
          type="company"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="role"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="status"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="dateApplied"
          placeholder="DateApplied"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button className="bg-black text-white px-4 py-2 w-full">New Job</button>
      </form>
    </>

    // display jobs
  );
}

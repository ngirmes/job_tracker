import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getJobs();
  }, [page]);

  useEffect(() => {
    if (jobs.length === 0 && page > 1) {
      setPage((p) => p - 1);
    }
  }, [jobs]);

  async function getJobs() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/jobs?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    setTotal(data.row.total);
    setJobs(data.rows);
  }

  async function postJob(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        status,
        dateApplied,
      }),
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    } else if (res.ok) {
      console.log("Job posted succesfully", data);
      await getJobs();

      // Clear form
      setCompany("");
      setRole("");
      setStatus("");
      setDateApplied("");
    } else {
      console.error(data.error);
    }
  }

  async function patchStatus(id: number) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/jobs/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    if (res.ok) {
      console.log(data);
      setStatus(status);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...jobs, status: status } : job)),
      );
    } else {
      console.log(data.error);
    }
  }

  async function deleteJob(id: number) {
    if (!window.confirm("Delete this job?")) {
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    // If 204 is returned
    else if (res.ok) {
      console.log("Job deleted succesfully");
      await getJobs();
    } else {
      const data = await res.json();
      console.log(data.error);
    }
  }

  return (
    <>
      <>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>
          {jobs.map((job) => (
            <div key={job.id}>
              <button onClick={() => patchStatus(job.id)}>Update status</button>
              <button onClick={() => deleteJob(job.id)}>
                <Trash2 size={14} />
              </button>
              <h3>{job.company}</h3>
              <p>{job.role}</p>
              <p>{job.status}</p>
              <p>{job.dateApplied}</p>
            </div>
          ))}
        </div>
      </>
      <>
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
            placeholder="Date Applied"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button className="px-4 py-2 w-full">New Job</button>
        </form>
      </>
    </>

    // display jobs
  );
}

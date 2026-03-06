import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

type DashboardProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [newStatus, setNewStatus] = useState("")
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus
      }),
    });
    console.log('test1')
    const data = await res.json();
    console.log('test2')
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    if (res.ok) {
      console.log(data);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job)),
      );
      setNewStatus("")
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

  async function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <div className="grid grid-cols-3 gap-8 p-8 border-4 border-black">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-4">
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
          className="border-2 rounded-lg border-black p-2 hover:border-green-500 mr-2"
        >
          Next
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border-2 rounded-lg border-black p-2 hover:border-green-500"
        >
          Previous
        </button>
          <p>New Status:</p>
          <input
            type="text"
            placeholder="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2"
          />
        </div>
        <div className="grid grid-cols-5 gap-4">
          <p className="font-bold">Company</p>
          <p className="font-bold">Role</p>
          <p className="font-bold">Status</p>
          <p className="font-bold">Date Applied</p>
          <p className="font-bold">Actions</p>
        </div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-5 gap-4 py-2 items-center"
          >
            <p className="">{job.company}</p>
            <p className="">{job.role}</p>
            <p>{job.status}</p>
            <p>{job.dateApplied}</p>
            <div className="flex gap-2">
              <button
                onClick={() => patchStatus(job.id)}
                className="border-2 rounded-lg border-black p-2 hover:border-green-500"
              >
                Update status
              </button>
              <button
                onClick={() => deleteJob(job.id)}
                className="border-2 rounded-lg border-black p-2 hover:border-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-1">
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
          <button className="px-4 py-2 w-full border-2 rounded-lg border-black p-2 hover:border-green-500">
            Submit New Job
          </button>
        </form>
      </div>
      <button
        onClick={() => logout()}
        className="px-4 py-2 w-full border-2 rounded-lg border-black p-2 hover:border-blue-500"
      >
        Logout
      </button>
    </div>
  );
}

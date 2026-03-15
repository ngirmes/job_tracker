import { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import Confetti from "react-confetti";
import { Navigate } from "react-router-dom";

type DashboardProps = {
  setIsAuthenticated: (value: boolean) => void;
};

type Job = {
  id: number;
  company: string;
  role: string;
  status: string;
  dateApplied: string;
};

export default function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalJobID, setStatusModalJobID] = useState(-1);
  const [dateApplied, setDateApplied] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [confettiTimer, setConfettiTimer] = useState(5000);
  const postJobContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (postJobContainerRef.current) {
      setConfettiSize({
        width: postJobContainerRef.current.offsetWidth,
        height: postJobContainerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    getJobs();
  }, [page]);

  useEffect(() => {
    if (jobs.length === 0 && page > 1) {
      setPage((p) => p - 1);
    }
  }, [jobs]);

  async function getJobs() {
    console.count("getJobs");
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
      setIsAuthenticated(false);
      return <Navigate to="/login" />;
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
        status: "applied",
        dateApplied,
      }),
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } else if (res.ok) {
      console.log("Job posted succesfully", data);
      setShowConfetti(true);
      setConfettiTimer(3000);
      setConfettiOpacity(1);
      const interval = setInterval(() => {
        setConfettiTimer((prev) => {
          if (prev <= 10) {
            clearInterval(interval);
          }
          if (prev <= 1000) {
            setConfettiOpacity((prev) => Math.max(prev - 0.02, 0));
          }
          return prev - 10;
        });
      }, 10);
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
    console.log(newStatus);

    const res = await fetch(`http://localhost:3000/jobs/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });
    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }

    if (res.ok) {
      console.log(data);
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job,
        ),
      );
      setNewStatus("");
    } else {
      console.log(data.error);
    }
  }

  async function deleteJob(id: number) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
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
    <>
      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-neutral-50 p-4 border-black border-2 grid grid-rows-4 gap-2 rounded-lg">
            <label htmlFor="status" className="text-2xl">
              New Status:
            </label>
            <p>(applied, interviewed, offered, rejected)</p>
            <input
              id="status"
              type="text"
              placeholder="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border-black border-2 p-4"
            />
            <button
              onClick={() => {
                patchStatus(statusModalJobID);
                setShowStatusModal(false);
                setStatusModalJobID(-1);
              }}
              className="hover:border-green-500 border-black border-2 rounded-lg"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setShowStatusModal(false);
                setStatusModalJobID(-1);
              }}
              className="hover:border-red-500 border-black border-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 via-50% to-blue-200">
        <div className="grid grid-cols-3 gap-8 p-8">
          <div className="col-span-2 bg-neutral-50 border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="border-2 rounded-lg border-black p-2 hover:border-blue-500 mr-2 disabled:border-grey-100"
              >
                Next Page
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-2 rounded-lg border-black p-2 hover:border-blue-500"
              >
                Previous Page
              </button>
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
                    onClick={() => {
                      setShowStatusModal(true);
                      setStatusModalJobID(job.id);
                    }}
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

          <div
            className="col-span-1 bg-neutral-50 rounded-lg border-2 border-black"
            ref={postJobContainerRef}
          >
            <div className="relative">
              {showConfetti && (
                <Confetti
                  width={confettiSize.width}
                  height={confettiSize.height}
                  opacity={confettiOpacity}
                  gravity={0.2}
                />
              )}
            </div>
            <form onSubmit={postJob} className="p-8 max-w-md mx-auto">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border p-2 w-full mb-4"
              />

              <label htmlFor="role">Role</label>
              <input
                id="role"
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 w-full mb-4"
              />

              <label htmlFor="dateApplied">Date Applied</label>
              <input
                id="dateApplied"
                type="date"
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
        </div>
      </div>
    </>
  );
}

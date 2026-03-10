import { useState } from "react";

type Adsprops = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Ads({ setIsAuthenticated }: Adsprops) {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [distance, setDistance] = useState("");
  const [foundJobs, setFoundJobs] = useState(false);
  const [ads, setAds] = useState([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3000/jobs/ads/?what=${what}&where=${where}&distance=${distance}`,
      {
        method: "GET",
      },
    );

    const data = await res;

    if (res.ok) {
      setAds(data);
      setFoundJobs(true);
    }

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }

  return (
    <div className="grid grid-cols-3">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-neutral-800 border-4 bg-neutral-200 p-8 max-w-md w-full shadow-2xl grid-span-1"
      >
        <input
          type="what"
          placeholder="What"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="where"
          placeholder="Where"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="distance"
          placeholder="Distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button className="bg-stone-900 text-white hover:bg-blue-300 hover:text-black hover:border-2 hover:border-black px-4 py-2 w-full">
          Search
        </button>
      </form>
      (foundJobs && )
    </div>
  );
}

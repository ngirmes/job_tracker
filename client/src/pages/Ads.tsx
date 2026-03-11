import { useState } from "react";

type Adsprops = {
  setIsAuthenticated: (value: boolean) => void;
};

type Ad = {
  id: number;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  title: string;
  contract_type: string;
  description: string;
  salary_min: number;
  salary_max: number;
  created: string;
};

export default function Ads({ setIsAuthenticated }: Adsprops) {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [distance, setDistance] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/jobs/ads/?what=${what}&where=${where}&distance=${distance}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }

    if (res.ok) {
      setAds(data.ads);
    }
  }

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border-neutral-800 border-4 bg-neutral-200 p-8 max-w-md w-full shadow-2xl "
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
      </div>
      <div className="col-span-2">
        {ads.map((ad) => (
          <div key={ad.id}>
            <p>{ad.company.display_name}</p>
            <p>{ad.title}</p>
            <p>{ad.contract_type}</p>
            <p>{ad.description}</p>
            <p>{ad.salary_min}</p>
            <p>{ad.salary_max}</p>
            <p>{ad.created}</p>
            <p>{ad.location.display_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

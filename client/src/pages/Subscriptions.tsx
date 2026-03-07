import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SubscriptionsProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Subscriptions({
  setIsAuthenticated,
}: SubscriptionsProps) {
  const token = localStorage.getItem("token");
  const plans = {
    oneMonth: 14.99,
    sixMonths: 5.99,
  };
  const subStart = new Date();
  const subEnd = new Date();
  subEnd.setMonth(subStart.getMonth() + 6);
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState(0);

  async function subscribe() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
        price,
        subStart,
        subEnd,
      }),
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }

  return (
    <>
      <div className="">
        <button onClick={() => setPlan(plans[0])}>One Month</button>
        <button onClick={() => setPlan(plans[1])}>Six Months</button>
        <button onClick={() => subscribe()}>Subscribe</button>
      </div>
    </>
  );
}

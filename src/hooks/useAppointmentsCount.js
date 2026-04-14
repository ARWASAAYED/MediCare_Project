import { useState, useEffect } from "react";

export default function useAppointmentsCount(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let url = "http://localhost:3000/appointments";
    if (userId) url += `?userId=${userId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCount(data.length);
        else setCount(0);
      })
      .catch(() => setCount(0));
  }, [userId]);

  return count;
}

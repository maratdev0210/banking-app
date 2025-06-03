import { useEffect, useState } from "react";

export function useSession() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    sessionDeposits: 0,
    sessionWithdrawals: 0,
  });

  useEffect(() => {
    async function fetchSessionData() {
      const response = await fetch("/api/session/stats");
      const data = await response.json();
      setStats(data);
    }

    fetchSessionData();
  }, []);

  return { stats };
}

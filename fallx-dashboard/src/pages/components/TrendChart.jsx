import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../styles/trend.css"; // 👈 IMPORTANT
import { fetchAuthSession } from "aws-amplify/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TrendChart() {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        setError("");

        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${BACKEND_URL}/api/stats/trend?days=7`, {
          headers,
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load trend data");
        }

        setTrend(data.data || []);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  if (loading) return <div>Loading trend...</div>;
  if (error) return <div className="error">{error}</div>;

  const labels = trend.map((x) =>
    new Date(x.date).toLocaleDateString("en-SG", {
      day: "2-digit",
      month: "short",
    })
  );

  const values = trend.map((x) => x.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Falls",
        data: values,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 👈 KEY FIX
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="trend-card">
      <div className="trend-title">Falls Trend (Last 7 Days)</div>

      <div className="trend-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CountryInfo() {
  const { countryCode } = useParams();
  const [countryInfo, setCountryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/country/${countryCode}`
        );
        setCountryInfo(response.data);
      } catch (error) {
        setError("Error fetching country information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryInfo();
  }, [countryCode]);

  if (loading) return <div>Loading country information...</div>;
  if (error) return <div>{error}</div>;
  if (!countryInfo) return <div>No country information available.</div>;

  const chartData = {
    labels: countryInfo.populationData?.map((data) => data.year) || [],
    datasets: [
      {
        label: "Population",
        data: countryInfo.populationData?.map((data) => data.value) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 pt-1 mt-44 bg-white shadow-md rounded-lg">
        <Link
        to="/"
        className="absolute top-4 left-4 bg-white text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-300"
      >
        Back to Country List
      </Link>

      {countryInfo.flagUrl && (
        <div className="flex items-center justify-center mb-6">
          <img
            src={countryInfo.flagUrl}
            alt={`${countryCode} flag`}
            className="w-48 h-auto object-contain shadow-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-4 uppercase">
        {countryCode}
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Border Countries</h2>
        {countryInfo.borderCountries && countryInfo.borderCountries.length > 0 ? (
          <ul className="flex flex-wrap justify-start space-x-4">
            {countryInfo.borderCountries.map((border) => (
              <li key={border.countryCode}>
                <Link
                  to={`/country/${border.countryCode}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {border.commonName}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No border countries found.</p>
        )}
      </div>

      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-4">Population Chart</h2>
        {countryInfo.populationData && countryInfo.populationData.length > 0 ? (
          <div className="w-full h-72">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="text-gray-600">No population data available.</p>
        )}
      </div>
    </div>
  );
}

export default CountryInfo;


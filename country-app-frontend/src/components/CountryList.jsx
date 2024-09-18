import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          console.error("REACT_APP_API_URL is not defined in .env");
          return;
        }
        console.log("API URL:", apiUrl);
        const response = await axios.get(`${apiUrl}/countries`);
        console.log("Countries response:", response.data);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Country List</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <li key={country.countryCode} className="border p-4 rounded">
            <Link
              to={`/country/${country.countryCode}`}
              className="text-blue-500 hover:underline"
            >
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryList;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*' 
}));

app.use(express.json());

let countryNameMapping = {};

const loadCountryMapping = async () => {
  try {
    const response = await axios.get(`${process.env.DATE_NAGER_API}/AvailableCountries`);
    response.data.forEach(country => {
      countryNameMapping[country.countryCode] = country.name;
    });
    console.log('Country name mapping loaded:', countryNameMapping);
  } catch (error) {
    console.error('Error loading country name mapping:', error);
  }
};

loadCountryMapping();

app.get('/api/countries', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.DATE_NAGER_API}/AvailableCountries`);
    console.log('Available countries:', response.data); 
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching countries:', error); 
    res.status(500).json({ error: 'Error fetching countries' });
  }
});

app.get('/api/country/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  console.log('Received request for country:', countryCode);
  
  const countryName = countryNameMapping[countryCode.toUpperCase()];
  
  if (!countryName) {
    return res.status(404).json({ error: 'Country not found in mapping' });
  }
  
  try {
    const [borderCountries, populationData, flagData] = await Promise.all([
      axios.get(`${process.env.DATE_NAGER_API}/CountryInfo/${countryCode}`),
      axios.post(`${process.env.COUNTRIES_NOW_API}/countries/population`, { country: countryName }),
      axios.post(`${process.env.COUNTRIES_NOW_API}/countries/flag/images`, { country: countryName })
    ]);

    console.log('Border countries response:', borderCountries.data);
    console.log('Population data response:', populationData.data);
    console.log('Flag data response:', flagData.data);

    const countryInfo = {
      borderCountries: borderCountries.data.borders || [],
      populationData: populationData.data.data.populationCounts || [],
      flagUrl: flagData.data.data.flag || ''
    };

    res.json(countryInfo);
  } catch (error) {
    console.error('Error fetching country info:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching country info' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

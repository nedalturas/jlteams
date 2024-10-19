// netlify/functions/fetchSheet.js
import fetch from 'node-fetch'; // Changed to ES module import

export const handler = async function (event, context) { // Changed to ES module export
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY; // Ensure this is set in your Netlify environment variables
  const sheetId = '1aAOwWOLyUdbT2a3F4IBTHDPnXBlBH240OFtIKom5H9Q';
  const range = 'Sheet1!A1:D10'; // Specify the sheet range you want

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Error fetching data:', response.statusText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch data' }),
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};

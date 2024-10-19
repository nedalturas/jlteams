// netlify/functions/fetchSheet.js
import fetch from 'node-fetch'; // Changed to ES module import

export const handler = async function (event, context) { // Changed to ES module export
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = '1aAOwWOLyUdbT2a3F4IBTHDPnXBlBH240OFtIKom5H9Q';
  const range = 'Sheet1!A1:D10'; // Specify the sheet range you want

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};

const { google } = require('googleapis');

// Replace with your actual sheet ID, API key, and sheet name
const sheetId = process.env.SHEET_ID; 
const apiKey = process.env.GOOGLE_SHEETS_API_KEY; 
const sheetName = 'Sheet1';

// Initialize Google Sheets API client
const auth = new google.auth.GoogleAuth({
  keyFile: null, // No need to specify keyFile as apiKey is being used
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function fetchSheetData() {

  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });

    const sheetData = response.data.values;

    const companies = [];

    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const company = {
        name: row[0],
        cities: {
          Dubai: row[1] === 'TRUE',
          'Abu Dhabi': row[2] === 'TRUE',
          Sharjah: row[3] === 'TRUE',
          Ajman: row[4] === 'TRUE',
          'Al Ain': row[5] === 'TRUE',
        },
        services: row[6].split(',').map((service) => service.trim()),
        status: row[7],
        whatsapp: row[8],
        completeDetail: row[10],
      };
      companies.push(company);
    }

    return companies; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
  
};

// Netlify function handler
exports.handler = async (event, context) => {
  try {
    const companies = await fetchSheetData();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companies),
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
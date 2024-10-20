const sheetId = '1aAOwWOLyUdbT2a3F4IBTHDPnXBlBH240OFtIKom5H9Q'; // Replace with your actual sheet ID
const apiKey = 'AIzaSyCCmTvkwrp1wX5KdCrycH3gixVnAGA77OY'; // Replace with your actual API key
const sheetName = 'Sheet1'; // Name of the sheet you're working with

const cityOptions = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain'];

// Fetch data from Google Sheets
async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values; // Returns all the rows
}

// Function to extract companies from the sheet data
function processSheetData(sheetData) {
  const headers = sheetData[0];
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
      // Assuming services are in a comma-separated string like "Home Cleaning, Deep Cleaning"
      services: row[6].split(',').map((service) => service.trim()), // Split into array and trim whitespace
      status: row[7],
      whatsapp: row[8],
      completeDetail: row[10],
    };
    companies.push(company);
  }

  return companies;
}


// Render table rows based on filtered companies
function renderTable(filteredCompanies) {
  const tableBody = document.querySelector('#companyTable tbody');
  tableBody.innerHTML = ''; // Clear the table

  filteredCompanies.forEach((company) => {
    const citiesCovered = cityOptions
      .filter((city) => company.cities[city])
      .join(', ');
    const servicesOffered = company.services.join(', '); // Join services array into string

    // Add 'positive' class for active and 'negative' for inactive companies
    const rowClass =
      company.status === 'Active' ? 'neutral' : 'negative disabled';

    const row = document.createElement('tr');
    row.className = rowClass;

    row.innerHTML = `
      <td>${company.name}</td>
      <td>${citiesCovered}</td>
      <td>${servicesOffered}</td>
      <td>
        <div class="mini ui vertical  primary button" tabindex="0">
          <div class="visible content">
            <i class="eye icon"></i>
          </div>
        </div>
      </td>
    `;

    // Add event listener for the button
    const button = row.querySelector('.mini.button');
    button.addEventListener('click', () => showModal(company));

    tableBody.appendChild(row);
  });
}

function showModal(company) {
  // Populate the modal with company details
  document.getElementById('modalCompanyName').textContent = company.name;
  document.getElementById('modalCitiesCovered').textContent = cityOptions
    .filter((city) => company.cities[city])
    .join(', ');
  document.getElementById('modalServicesOffered').textContent =
    company.services.join(', ');
  document.getElementById('modalCompanyStatus').textContent = company.status;

  const whatsappElement = document.getElementById('modalWhatsapp');
  whatsappElement.innerHTML = ''; // Clear any previous content

  if (modalCompanyStatus.textContent == 'Active') {
    modalCompanyStatus.style.color = 'green';
  } else {
    modalCompanyStatus.style.color = 'red';
  }

  // Check if WhatsApp link exists, if not, show 'N/A'
  if (company.whatsapp && company.whatsapp.trim() !== '') {
    const whatsappLink = document.createElement('a');
    whatsappLink.href = company.whatsapp; // Use the link directly from the sheet
    whatsappLink.setAttribute('target', '_blank');
    whatsappLink.textContent = 'Contact via WhatsApp'; // Display text for the link
    whatsappElement.appendChild(whatsappLink);
  } else {
    whatsappElement.textContent = 'N/A'; // Display N/A if no link is present
  }

  document.getElementById('serviceDetail').textContent = company.completeDetail;

  // Show the modal
  $('.ui.modal')
    .modal({ centered: false, transition: 'slide down', closable: false })
    .modal('show');
}

// Filter logic for search, city, and service type
function filterTable(companies) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const selectedCity = document.getElementById('cityFilter').value;
  const selectedServiceType =
    document.getElementById('serviceTypeFilter').value;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm);
    const matchesCity = selectedCity === 'all' || company.cities[selectedCity];
    const matchesServiceType =
      selectedServiceType === 'all' ||
      company.services.includes(selectedServiceType); // Check if company offers the selected service

    return matchesSearch && matchesCity && matchesServiceType;
  });

  renderTable(filteredCompanies);
}

// Populate city filter dropdown
function populateCityDropdown() {
  const cityFilter = document.getElementById('cityFilter');
  cityOptions.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
}

// Populate service type filter dropdown
function populateServiceTypeDropdown(companies) {
  const serviceTypeFilter = document.getElementById('serviceTypeFilter');
  const uniqueServiceTypes = [
    ...new Set(companies.flatMap((company) => company.services)),
  ]; // Flatten the array and remove duplicates

  uniqueServiceTypes.forEach((service) => {
    const option = document.createElement('option');
    option.value = service;
    option.textContent = service;
    serviceTypeFilter.appendChild(option);
  });
}

// Add event listeners for filtering
function addFilterListeners(companies) {
  document
    .getElementById('searchInput')
    .addEventListener('input', () => filterTable(companies));
  document
    .getElementById('cityFilter')
    .addEventListener('change', () => filterTable(companies));
  document
    .getElementById('serviceTypeFilter')
    .addEventListener('change', () => filterTable(companies));
}

// Initialize the table and filters
document.addEventListener('DOMContentLoaded', async function () {
  // Initialize the table and filters
  async function init() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('active');

    const sheetData = await fetchSheetData();
    const companies = processSheetData(sheetData);

    // Initial render
    renderTable(companies);

    // Populate dropdowns and add filter listeners
    populateCityDropdown();
    populateServiceTypeDropdown(companies);
    addFilterListeners(companies);
    $('.ui.dropdown').dropdown();

    // Hide the loader
    if (loader) loader.classList.remove('active');
  }

  // Run initialization
  init();
});

// Run initialization

const parkStateMap = {};

// Utility date formatting
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}
function formatDateForDatePicker(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
}

// --- Tab switching ---
const tabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');

    tab.classList.add('active');
    const tabId = tab.dataset.tab;
    document.getElementById(tabId).style.display = 'block';
  });
});

// --- Customize Passport Stamp tab setup ---


fetch("national_sites.csv")
  .then(response => response.text())
  .then(csvData => {
    const lines = csvData.split("\n");
    const selectElement = document.getElementById("nationalPark");

    for (const line of lines) {
      const columns = line.split(",");
      const parkName = columns[0]?.trim();
      const stateName = columns[1]?.trim();

      if (parkName && stateName) {
        parkStateMap[parkName] = stateName;

        const option = document.createElement("option");
        option.value = parkName;
        option.textContent = parkName;
        selectElement.appendChild(option);
      }
    }

    if (selectElement.options.length > 0) {
      selectElement.selectedIndex = 0;
      const selectedPark = selectElement.value;
      document.getElementById("selectedNationalParkPath").textContent = selectedPark;

      // Set initial color based on state
      const initialState = parkStateMap[selectedPark];
      const initialColor = stateColors[initialState];
      if (initialColor) {
        stampColorInput.value = initialColor;
        updateStampColor(initialColor);
      }
    }
  })
  .catch(error => console.error("Error fetching CSV:", error));


const stateColors = {
  // North Atlantic
  "Maine": "#003366",
  "New Hampshire": "#003366",
  "Vermont": "#003366",
  "Massachusetts": "#003366",
  "Rhode Island": "#003366",
  "Connecticut": "#003366",
  "New York": "#003366",
  "New Jersey": "#003366",

  // Mid-Atlantic
  "Pennsylvania": "#0066CC",
  "Delaware": "#0066CC",
  "Maryland": "#0066CC",
  "Virginia": "#0066CC",
  "West Virginia": "#0066CC",

  // National Capital
  "District of Columbia": "#66CCFF",

  // Southeast
  "Kentucky": "#339966",
  "North Carolina": "#339966",
  "South Carolina": "#339966",
  "Tennessee": "#339966",
  "Georgia": "#339966",
  "Alabama": "#339966",
  "Mississippi": "#339966",
  "Florida": "#339966",

  // Midwest
  "Ohio": "#FF9933",
  "Indiana": "#FF9933",
  "Illinois": "#FF9933",
  "Michigan": "#FF9933",
  "Wisconsin": "#FF9933",
  "Minnesota": "#FF9933",
  "Iowa": "#FF9933",
  "Missouri": "#FF9933",
  "North Dakota": "#FF9933",
  "South Dakota": "#FF9933",
  "Nebraska": "#FF9933",
  "Kansas": "#FF9933",

  // Pacific Northwest & Alaska
  "Washington": "#9966CC",
  "Oregon": "#9966CC",
  "Idaho": "#9966CC",
  "Alaska": "#9966CC",

  // Western
  "California": "#CC3333",
  "Nevada": "#CC3333",
  "Hawaii": "#CC3333",

  // Rocky Mountain
  "Montana": "#996633",
  "Wyoming": "#996633",
  "Utah": "#996633",
  "Colorado": "#996633",

  // Southwest
  "Arizona": "#009999",
  "New Mexico": "#009999",
  "Oklahoma": "#009999",
  "Texas": "#009999"
};



const selectedNationalParkElement = document.getElementById("selectedNationalParkPath");
const visitDateElement = document.getElementById("visitDate");
const nationalParkSelect = document.getElementById("nationalPark");
const visitDateInput = document.getElementById("visitDateInput");
const stampColorInput = document.getElementById("stampColor");
const fontSelect = document.getElementById("fontSelect");
const stampElement = document.getElementById("stamp");

const today = new Date();
visitDateElement.textContent = formatDate(today);
visitDateInput.value = formatDateForDatePicker(today);

function updateStampFont(fontFamily) {
  selectedNationalParkElement.style.fontFamily = fontFamily;
  visitDateElement.style.fontFamily = fontFamily;
}

function updateStampColor(color) {
  stampElement.style.borderColor = color;
  selectedNationalParkElement.style.fill = color;
  visitDateElement.style.color = color;
}

nationalParkSelect.addEventListener("change", () => {
  const selectedPark = nationalParkSelect.value;
  selectedNationalParkElement.textContent = selectedPark;

  const stateName = parkStateMap[selectedPark];
  const color = stateColors[stateName];

  if (color) {
    stampColorInput.value = color;
    updateStampColor(color);
  }
});


visitDateInput.addEventListener("input", () => {
  const date = new Date(visitDateInput.value + 'T00:00');
  visitDateElement.textContent = formatDate(date);
});

stampColorInput.addEventListener("input", () => {
  updateStampColor(stampColorInput.value);
});

fontSelect.addEventListener("change", () => {
  updateStampFont(fontSelect.value);
});

updateStampFont(fontSelect.value);

function downloadStamp() {
  const stampColor = stampColorInput.value;
  const parkName = selectedNationalParkElement.textContent;
  const visitDate = visitDateElement.textContent;
  const fontFamily = fontSelect.value;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('xmlns', svgNS);
  svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', xlinkNS);
  svg.setAttribute('width', '400');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 200 200');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '100');
  circle.setAttribute('cy', '100');
  circle.setAttribute('r', '85');
  circle.setAttribute('stroke', stampColor);
  circle.setAttribute('stroke-width', '4');
  circle.setAttribute('fill', 'none');
  svg.appendChild(circle);

  const defs = document.createElementNS(svgNS, 'defs');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('id', 'circlePath');
  path.setAttribute('d', 'M 100, 185 a 85,85 0 0,1 -85,-85 a 85,85 0 0,1 170,0 a 85,85 0 0,1 -85,85');
  defs.appendChild(path);
  svg.appendChild(defs);

  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('dy', '15');

  const textPath = document.createElementNS(svgNS, 'textPath');
  textPath.setAttributeNS(xlinkNS, 'xlink:href', '#circlePath');
  textPath.setAttribute('startOffset', '50%');
  textPath.setAttribute('text-anchor', 'middle');
  textPath.setAttribute('fill', stampColor);
  textPath.setAttribute('font-family', fontFamily);
  textPath.setAttribute('font-size', '15');
  textPath.setAttribute('font-weight', '300');
  textPath.textContent = parkName;
  text.appendChild(textPath);
  svg.appendChild(text);

  const visitText = document.createElementNS(svgNS, 'text');
  visitText.setAttribute('x', '100');
  visitText.setAttribute('y', '110');
  visitText.setAttribute('text-anchor', 'middle');
  visitText.setAttribute('font-family', fontFamily);
  visitText.setAttribute('font-size', '13');
  visitText.setAttribute('fill', stampColor);
  visitText.textContent = visitDate;
  svg.appendChild(visitText);

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = `passport_stamp_${parkName.replace(/\s+/g, '_')}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

document.getElementById("downloadButton").addEventListener("click", downloadStamp);

// --- Customize Personal Stamp tab setup ---

const personalTextInput = document.getElementById("personalText");
const personalVisitDateInput = document.getElementById("personalVisitDateInput");
const personalVisitDateElement = document.getElementById("personalVisitDate");
const personalStampColorInput = document.getElementById("personalStampColor");
const personalFontSelect = document.getElementById("personalFontSelect");
const personalStampElement = document.getElementById("personalStamp");
const personalTextPath = document.getElementById("personalTextPath");

personalVisitDateElement.textContent = formatDate(today);
personalVisitDateInput.value = formatDateForDatePicker(today);

function updatePersonalStampFont(fontFamily) {
  personalTextPath.style.fontFamily = fontFamily;
  personalVisitDateElement.style.fontFamily = fontFamily;
}

function updatePersonalStampColor(color) {
  personalStampElement.style.borderColor = color;
  personalTextPath.style.fill = color;
  personalVisitDateElement.style.color = color;
}

personalTextInput.addEventListener("input", () => {
  const val = personalTextInput.value.trim();
  personalTextPath.textContent = val || "Your Text Goes Here";
});

personalVisitDateInput.addEventListener("input", () => {
  const date = new Date(personalVisitDateInput.value + 'T00:00');
  personalVisitDateElement.textContent = formatDate(date);
});

personalStampColorInput.addEventListener("input", () => {
  updatePersonalStampColor(personalStampColorInput.value);
});

personalFontSelect.addEventListener("change", () => {
  updatePersonalStampFont(personalFontSelect.value);
});

updatePersonalStampFont(personalFontSelect.value);

function downloadPersonalStamp() {
  const stampColor = personalStampColorInput.value;
  const personalText = personalTextInput.value.trim() || "Your Text Goes Here";
  const visitDate = personalVisitDateElement.textContent;
  const fontFamily = personalFontSelect.value;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('xmlns', svgNS);
  svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', xlinkNS);
  svg.setAttribute('width', '400');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 200 200');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '100');
  circle.setAttribute('cy', '100');
  circle.setAttribute('r', '85');
  circle.setAttribute('stroke', stampColor);
  circle.setAttribute('stroke-width', '4');
  circle.setAttribute('fill', 'none');
  svg.appendChild(circle);

  const defs = document.createElementNS(svgNS, 'defs');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('id', 'personalCirclePath');
  path.setAttribute('d', 'M 100, 185 a 85,85 0 0,1 -85,-85 a 85,85 0 0,1 170,0 a 85,85 0 0,1 -85,85');
  defs.appendChild(path);
  svg.appendChild(defs);

  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('dy', '15');

  const textPath = document.createElementNS(svgNS, 'textPath');
  textPath.setAttributeNS(xlinkNS, 'xlink:href', '#personalCirclePath');
  textPath.setAttribute('startOffset', '50%');
  textPath.setAttribute('text-anchor', 'middle');
  textPath.setAttribute('fill', stampColor);
  textPath.setAttribute('font-family', fontFamily);
  textPath.setAttribute('font-size', '15');
  textPath.setAttribute('font-weight', '300');
  textPath.textContent = personalText;
  text.appendChild(textPath);
  svg.appendChild(text);

  const visitText = document.createElementNS(svgNS, 'text');
  visitText.setAttribute('x', '100');
  visitText.setAttribute('y', '110');
  visitText.setAttribute('text-anchor', 'middle');
  visitText.setAttribute('font-family', fontFamily);
  visitText.setAttribute('font-size', '13');
  visitText.setAttribute('fill', stampColor);
  visitText.textContent = visitDate;
  svg.appendChild(visitText);

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = `personal_stamp_${personalText.replace(/\s+/g, '_')}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

document.getElementById("downloadPersonalButton").addEventListener("click", downloadPersonalStamp);

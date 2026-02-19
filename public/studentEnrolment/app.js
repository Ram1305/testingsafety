const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:7419' 
  : 'https://safety-training-academy-api-dnfagvdpcee2e6gm.australiaeast-01.azurewebsites.net';

// Get enrollment ID from URL query parameter
function getEnrollmentIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || urlParams.get('formId');
}

// Check if auto-print is requested
function shouldAutoPrint() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('print') === 'true';
}

// Get auth token from localStorage or sessionStorage
function getAuthToken() {
  // Try to get token from localStorage first
  let token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (!token) {
    token = sessionStorage.getItem('authToken') || sessionStorage.getItem('token');
  }
  return token;
}

// Fetch enrollment form data from API
async function fetchEnrollmentFormData(formId) {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Use the correct endpoint path - API routes include /api prefix
    // Note: Using mode: 'cors' without credentials for cross-origin requests
    const response = await fetch(`${API_BASE_URL}/api/StudentEnrollmentForm/admin/${formId}`, {
      method: 'GET',
      mode: 'cors',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch enrollment form');
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Invalid response');
  } catch (error) {
    console.error('Error fetching enrollment form:', error);
    throw error;
  }
}

// Map API response to form data structure
function mapApiDataToFormData(apiData) {
  console.log('Mapping API data:', apiData);
  
  return {
    // Page 1 - Applicant Details
    title: apiData.title || '',
    surname: apiData.surname || '',
    givenName: apiData.givenName || '',
    middleName: apiData.middleName || '',
    preferredName: apiData.preferredName || '',
    dob: apiData.dateOfBirth ? apiData.dateOfBirth.split('T')[0] : '',
    gender: apiData.gender || '',
    email: apiData.email || '',
    homePhone: apiData.homePhone || '',
    workPhone: apiData.workPhone || '',
    mobilePhone: apiData.mobile || '',
    resAddress: apiData.residentialAddress || '',
    resSuburb: apiData.residentialSuburb || '',
    resState: apiData.residentialState || '',
    resPostcode: apiData.residentialPostcode || '',
    postalAddress: apiData.postalAddress || '',
    postalSuburb: apiData.postalSuburb || '',
    postalState: apiData.postalState || '',
    postalPostcode: apiData.postalPostcode || '',
    emergency: {
      name: apiData.emergencyContactName || '',
      relationship: apiData.emergencyContactRelationship || '',
      contactNumber: apiData.emergencyContactNumber || '',
      consent: apiData.emergencyPermission || 'Yes'
    },
    usi: { 
      permission: apiData.usiAccessPermission === true || apiData.usiAccessPermission === 'Yes', 
      number: apiData.usi || '' 
    },

    // Page 2 - USI Application
    usiApply: { 
      name: apiData.usiAuthoriseName || '', 
      consent: apiData.usiConsent === true || apiData.usiConsent === 'Yes', 
      townCityBirth: apiData.townCityOfBirth || '' 
    },
    identity: {
      driversLicence: { 
        state: apiData.driversLicenceState || '', 
        number: apiData.driversLicenceNumber || '' 
      },
      medicare: { 
        number: apiData.medicareNumber || '', 
        irn: apiData.medicareIRN || '', 
        colour: apiData.medicareCardColor || '', 
        expiry: apiData.medicareExpiry || '' 
      },
      birthCertificate: { state: apiData.birthCertificateState || '' },
      immicard: { number: apiData.immiCardNumber || '' },
      australianPassport: { number: apiData.australianPassportNumber || '' },
      nonAustralianPassport: { 
        number: apiData.nonAustralianPassportNumber || '', 
        country: apiData.nonAustralianPassportCountry || '' 
      },
      citizenshipCertificate: { 
        stock: apiData.citizenshipStockNumber || '', 
        acquisitionDate: apiData.citizenshipAcquisitionDate || '' 
      },
      registrationByDescent: { acquisitionDate: apiData.descentAcquisitionDate || '' }
    },
    officeUse: {
      photoIdType: '',
      passportNumber: '',
      driverLicenceNumber: '',
      otherText: ''
    },

    // Page 3 - Education
    page3: {
      priorEducation: mapSchoolLevel(apiData.schoolLevel),
      yearCompleted: apiData.schoolCompleteYear || '',
      schoolName: apiData.schoolName || '',
      schoolState: apiData.schoolState || '',
      schoolPostcode: apiData.schoolPostcode || '',
      schoolCountry: apiData.schoolCountry || '',
      hasQualifications: apiData.hasPostSecondaryQualification || 'No',
      qualificationTypes: apiData.qualificationLevels || [],
      employmentStatus: mapEmploymentStatus(apiData.employmentStatus),
      employerName: apiData.employerName || '',
      supervisorName: apiData.supervisorName || '',
      employerAddress: apiData.employerAddress || '',
      employerEmail: apiData.employerEmail || '',
      employerPhone: apiData.employerPhone || ''
    },

    // Page 4 - Additional Info
    page4: {
      reasonTrain: mapTrainingReason(apiData.trainingReason),
      reasonOther: apiData.trainingReasonOther || '',
      specialNeedsYN: apiData.hasDisability || 'No',
      specialNeedTypes: apiData.disabilityTypes || [],
      specialOther: apiData.disabilityNotes || '',
      countryBirth: apiData.countryOfBirth === 'Australia' ? 'Australia' : 'Other',
      countryBirthOther: apiData.countryOfBirth !== 'Australia' ? apiData.countryOfBirth : '',
      placeOfBirth: apiData.townCityOfBirth || '',
      atsi: mapIndigenousStatus(apiData.indigenousStatus),
      langHome: apiData.speaksOtherLanguage === 'Yes' ? 'Other' : 'EnglishOnly',
      langHomeOther: apiData.homeLanguage || '',
      englishLevel: 'VeryWell'
    },

    // Page 5 - Course Selection (not filled from API)
    page5: {
      qualification: '',
      applyCT: 'No',
      preferredStart: '',
      workplaceAccess: 'No',
      siteLocation: '',
      units: []
    },

    // Page 6 (not filled from API)
    page6: {
      units: []
    },

    // Page 14 - Payment
    page14: {
      payMethod: 'Bank',
      accountName: 'AIET College',
      bsb: '062 141',
      accountNo: '10490235',
      txnDesc: `${apiData.studentName || ''} / Enrollment`,
      submission: {
        address: '3/14-16 Marjorie Street, Sefton NSW 2162',
        email: 'info@safetytrainingacademy.edu.au',
        phone: '1300 976 097'
      }
    },

    // Page 15 - Declaration
    page15: {
      acknowledgements: [
        apiData.acceptedPrivacyNotice ? 'agreePrivacy' : '',
        apiData.acceptedTermsAndConditions ? 'agreeTerms' : ''
      ].filter(Boolean),
      studentName: apiData.declarationName || apiData.studentName || '',
      signature: apiData.signatureData || '',
      date: formatDeclarationDate(apiData.declarationDate)
    },

    // Metadata
    courseName: apiData.courseName || '',
    courseCode: apiData.courseCode || '',
    startDate: apiData.startDate || '',
    status: apiData.enrollmentFormStatus || ''
  };
}

// Helper function to format declaration date
function formatDeclarationDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Helper functions to map values
function mapSchoolLevel(level) {
  const mapping = {
    'Year 12 or equivalent': '12',
    'Year 11 or equivalent': '11',
    'Year 10 or equivalent': '10',
    'Year 9 or equivalent': '09',
    'Year 8 or below': '08',
    'Never attended school': '02'
  };
  return mapping[level] || '12';
}

function mapEmploymentStatus(status) {
  const mapping = {
    'Full-time employee': '01',
    'Part-time employee': '02',
    'Self-employed - not employing others': '03',
    'Self-employed - employing others': '04',
    'Employed - unpaid worker in family business': '05',
    'Unemployed - seeking full-time work': '06',
    'Unemployed - seeking part-time work': '07',
    'Not employed - not seeking employment': '08'
  };
  return mapping[status] || '08';
}

function mapTrainingReason(reason) {
  const mapping = {
    'To get a job': '01',
    'To develop my existing business': '02',
    'To start my own business': '03',
    'To try for a different career': '04',
    'To get a better job or promotion': '05',
    'It is a requirement for my job': '06',
    'I wanted extra skills for my job': '07',
    'To get into another course of study': '08',
    'For personal interest or self-development': '12',
    'Other': '11'
  };
  return mapping[reason] || '01';
}

function mapIndigenousStatus(status) {
  const mapping = {
    'No': 'No',
    'Aboriginal': 'Aboriginal',
    'Torres Strait Islander': 'Torres',
    'Aboriginal and Torres Strait Islander': 'Both'
  };
  return mapping[status] || 'No';
}

// API configuration - will be replaced in production
const fakeData = {
  // Page 1
  title: "Mr",
  surname: "Panchalingam",
  givenName: "Dushman",
  middleName: "K.",
  preferredName: "Dush",
  dob: "1996-08-14",
  gender: "Male",
  email: "dushman@example.com",
  homePhone: "02 1234 5678",
  workPhone: "02 8765 4321",
  mobilePhone: "0412 345 678",
  resAddress: "12 Example Street",
  resSuburb: "Sefton",
  resState: "NSW",
  resPostcode: "2162",
  postalAddress: "PO Box 55",
  postalSuburb: "Sefton",
  postalState: "NSW",
  postalPostcode: "2162",
  emergency: {
    name: "Ravi Panchalingam",
    relationship: "Brother",
    contactNumber: "0439 007 746",
    consent: "Yes"
  },
  usi: { permission: true, number: "A1B2C3D4E5" },

  // Page 2
  usiApply: { name: "Dushman Panchalingam", consent: true, townCityBirth: "Colombo" },
  identity: {
    driversLicence: { state: "NSW", number: "12345678" },
    medicare: { number: "2950 12345 1", irn: "2", colour: "Green", expiry: "31/12/2030" },
    birthCertificate: { state: "NSW" },
    immicard: { number: "" },
    australianPassport: { number: "N1234567" },
    nonAustralianPassport: { number: "", country: "" },
    citizenshipCertificate: { stock: "", acquisitionDate: "" },
    registrationByDescent: { acquisitionDate: "" }
  },
  officeUse: {
    photoIdType: "Passport", // Passport | DriverLicence | Other
    passportNumber: "N1234567",
    driverLicenceNumber: "",
    otherText: ""
  },

  // Page 3
  page3: {
    priorEducation: "12",               // 12 | 11 | 10 | 09 | 08 | 02
    yearCompleted: "2013",
    schoolName: "Sefton High School",
    schoolState: "NSW",
    schoolPostcode: "2162",
    schoolCountry: "",
    hasQualifications: "Yes",           // Yes | No
    qualificationTypes: ["511","514"],  // 008,410,420,511,514,521,524,990
    employmentStatus: "01",             // 01..08
    employerName: "Example Pty Ltd",
    supervisorName: "John Smith",
    employerAddress: "14-16 Marjorie Street, Sefton NSW 2162",
    employerEmail: "hr@example.com",
    employerPhone: "02 9999 1111"
  },

  // Page 4
  page4: {
    reasonTrain: "06",            // 01,02,03,04,05,06,07,08,12,11
    reasonOther: "",
    specialNeedsYN: "No",         // Yes | No
    specialNeedTypes: ["12"],     // 11..19
    specialOther: "",
    countryBirth: "Australia",    // Australia | Other
    countryBirthOther: "",
    placeOfBirth: "",
    atsi: "No",                   // No | Torres | Aboriginal | Both
    langHome: "EnglishOnly",      // EnglishOnly | Other
    langHomeOther: "",
    englishLevel: "VeryWell"      // VeryWell | Well | NotWell | NotAtAll
  },

  // Page 5 ✅ (THIS must be INSIDE fakeData, not fakeData.page5 = ...)
  page5: {
    qualification: "CPC30220_Carpentry",
    applyCT: "No",
    preferredStart: "____/____/____",
    workplaceAccess: "Yes",
    siteLocation: "Sefton NSW",
    units: [
      "CPCWHS1001",
      "RIIWHS204E",
      "RIIWHS202E",
      "MSMWHS217",
      "MSMWHS201",
      "MSMPER300",
      "TLILIC0003"
    ]
  },
  // Page 14
  page14: {
    payMethod: "Bank", // Bank | Cash | EFTPOS
    accountName: "AIET College",
    bsb: "062 141",
    accountNo: "10490235",
    txnDesc: "Dushman Panchalingam / Invoice 001",
    submission: {
      address: "3/14-16 Marjorie Street, Sefton NSW 2162",
      email: "info@safetytrainingacademy.edu.au",
      phone: "1300 976 097"
    }
  },

  // Page 15 (if you really have a page 15 in your HTML)
  page15: {
    // Example structure (edit to match your HTML fields)
    acknowledgements: ["agreeTerms", "agreePrivacy"], // multi-check example
    studentName: "Dushman Panchalingam",
    signature: "Dushman P.",
    date: "07/02/2026"
  }

};

function formatDobDMY(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function setText(field, value) {
  const el = document.querySelector(`[data-field="${field}"]`);
  if (!el) return;
  el.textContent = value ?? "";
}

function setChecks(group, value) {
  document.querySelectorAll(`[data-check="${group}"]`).forEach(box => {
    const expected = box.getAttribute("data-value");
    if (expected === "true") {
      box.classList.toggle("checked", value === true);
      return;
    }
    box.classList.toggle("checked", String(value) === expected);
  });
}

function setMultiChecks(group, values) {
  const set = new Set((values || []).map(String));
  document.querySelectorAll(`[data-check="${group}"]`).forEach(box => {
    const v = box.getAttribute("data-value");
    box.classList.toggle("checked", set.has(String(v)));
  });
}

function fillUSI(usi) {
  const spans = document.querySelectorAll("#usiBoxes span");
  for (let i = 1; i < spans.length; i++) spans[i].textContent = "";
  const str = (usi || "").toUpperCase().slice(0, 10);
  for (let i = 0; i < str.length; i++) {
    if (spans[i + 1]) spans[i + 1].textContent = str[i];
  }
}

function setFillLine(key, value) {
  const wrap = document.querySelector(`[data-line="${key}"]`);
  if (!wrap) return;
  const valEl = wrap.querySelector(".fillVal");
  if (!valEl) return;
  valEl.textContent = value ?? "";
}

/* ---------------- PAGE 1 ---------------- */
function fillPage1(d){
  setChecks("title", d.title);
  setText("surname", d.surname);
  setText("givenName", d.givenName);
  setText("middleName", d.middleName);
  setText("preferredName", d.preferredName);
  setText("dobDMY", formatDobDMY(d.dob));
  setChecks("gender", d.gender);

  setText("email", d.email);
  setText("homePhone", d.homePhone);
  setText("workPhone", d.workPhone);
  setText("mobilePhone", d.mobilePhone);

  setText("resAddress", d.resAddress);
  setText("resSuburb", d.resSuburb);
  setText("resState", d.resState);
  setText("resPostcode", d.resPostcode);

  setText("postalAddress", d.postalAddress);
  setText("postalSuburb", d.postalSuburb);
  setText("postalState", d.postalState);
  setText("postalPostcode", d.postalPostcode);

  setText("emgName", d.emergency?.name);
  setText("emgRelation", d.emergency?.relationship);
  setText("emgContact", d.emergency?.contactNumber);
  setChecks("emgConsent", d.emergency?.consent);

  setChecks("usiPermission", d.usi?.permission === true);
  fillUSI(d.usi?.number);
}

/* ---------------- PAGE 2 ---------------- */
function fillPage2(d){
  setFillLine("usiApplyName", d.usiApply?.name);
  setChecks("usiApplyConsent", d.usiApply?.consent === true);
  setFillLine("townCityBirth", d.usiApply?.townCityBirth);

  setFillLine("dlState", d.identity?.driversLicence?.state);
  setFillLine("dlNumber", d.identity?.driversLicence?.number);

  setFillLine("medicareNumber", d.identity?.medicare?.number);
  setFillLine("medicareIrn", d.identity?.medicare?.irn);
  setChecks("medicareColour", d.identity?.medicare?.colour);
  setFillLine("medicareExpiry", d.identity?.medicare?.expiry);

  setFillLine("bcState", d.identity?.birthCertificate?.state);
  setFillLine("immicardNumber", d.identity?.immicard?.number);

  setFillLine("ausPassportNumber", d.identity?.australianPassport?.number);

  setFillLine("nonAusPassportNumber", d.identity?.nonAustralianPassport?.number);
  setFillLine("nonAusPassportCountry", d.identity?.nonAustralianPassport?.country);

  setFillLine("citizenshipStock", d.identity?.citizenshipCertificate?.stock);
  setFillLine("citizenshipAcqDate", d.identity?.citizenshipCertificate?.acquisitionDate);

  setFillLine("descentAcqDate", d.identity?.registrationByDescent?.acquisitionDate);

  setChecks("photoIdType", d.officeUse?.photoIdType);
  setFillLine("officePassportNumber", d.officeUse?.passportNumber);
  setFillLine("officeDriverLicenceNumber", d.officeUse?.driverLicenceNumber);
  setFillLine("officeOtherText", d.officeUse?.otherText);
}

/* ---------------- PAGE 3 ---------------- */
function fillPage3(d){
  const p = d.page3 || {};
  setChecks("priorEdu", p.priorEducation);

  setFillLine("p3YearCompleted", p.yearCompleted);
  setFillLine("p3SchoolName", p.schoolName);
  setFillLine("p3SchoolState", p.schoolState);
  setFillLine("p3SchoolPostcode", p.schoolPostcode);
  setFillLine("p3SchoolCountry", p.schoolCountry);

  setChecks("qualHave", p.hasQualifications);
  setMultiChecks("qualType", p.qualificationTypes);

  setChecks("empStatus", p.employmentStatus);

  setText("p3EmployerName", p.employerName);
  setText("p3SupervisorName", p.supervisorName);
  setText("p3EmployerAddress", p.employerAddress);
  setText("p3EmployerEmail", p.employerEmail);
  setText("p3EmployerPhone", p.employerPhone);
}

/* ---------------- PAGE 4 ---------------- */
function fillPage4(d){
  const p = d.page4 || {};

  setChecks("reasonTrain", p.reasonTrain);
  setFillLine("p4ReasonOther", p.reasonOther);

  setChecks("specialNeedsYN", p.specialNeedsYN);
  setMultiChecks("specialNeedType", p.specialNeedTypes);
  setFillLine("p4SpecialOther", p.specialOther);

  setChecks("countryBirth", p.countryBirth);
  setFillLine("p4CountryBirthOther", p.countryBirthOther);
  setFillLine("p4PlaceOfBirth", p.placeOfBirth);

  setChecks("atsi", p.atsi);

  setChecks("langHome", p.langHome);
  setFillLine("p4LangHomeOther", p.langHomeOther);

  setChecks("englishLevel", p.englishLevel);
}

/* ---------------- PAGE 5 ---------------- */
function fillPage5(d){
  const p = d.page5 || {};
  setChecks("p5Qual", p.qualification);
  setChecks("p5ApplyCT", p.applyCT);
  setFillLine("p5PreferredStart", p.preferredStart);
  setChecks("p5WorkplaceAccess", p.workplaceAccess);
  setFillLine("p5SiteLocation", p.siteLocation);
  setMultiChecks("p5Units", p.units);
}

/* ---------------- PAGE 6 ---------------- */
function fillPage6(d){
  const p = d.page6 || {};
  setMultiChecks("p6Units", p.units);
}

/* ---------------- PAGE 14 ---------------- */
function fillPage14(d){
  const p = d.page14 || {};

  setChecks("p14PayMethod", p.payMethod);

  setText("p14AccountName", p.accountName);
  setText("p14Bsb", p.bsb);
  setText("p14AccountNo", p.accountNo);
  setFillLine("p14TxnDesc", p.txnDesc);

  setText("p14Address", p.submission?.address);
  setText("p14Email", p.submission?.email);
  setText("p14Phone", p.submission?.phone);
}

/* ---------------- PAGE 15 ---------------- */
function fillPage15(d){
  const p = d.page15 || {};

  setMultiChecks("p15Ack", p.acknowledgements);

  setFillLine("p15StudentName", p.studentName);
  setFillLine("p15Signature", p.signature);
  setFillLine("p15Date", p.date);
}

function fillAll(d){
  fillPage1(d);
  fillPage2(d);
  fillPage3(d);
  fillPage4(d);
  fillPage5(d);
  fillPage6(d);
  fillPage14(d);
  fillPage15(d);
}

// Show/hide loading overlay
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.toggle('hidden', !show);
  }
}

// Show error message
function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  const mainContent = document.getElementById('mainContent');
  
  if (errorContainer && errorMessage) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
  }
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  showLoading(false);
}

// Show main content
function showMainContent() {
  const mainContent = document.getElementById('mainContent');
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  showLoading(false);
}

// Initialize the form
async function initializeForm() {
  const formId = getEnrollmentIdFromUrl();
  const autoPrint = shouldAutoPrint();
  
  if (formId) {
    // Load from API
    showLoading(true);
    try {
      const apiData = await fetchEnrollmentFormData(formId);
      const formData = mapApiDataToFormData(apiData);
      showMainContent();
      fillAll(formData);
      
      // Auto-print if requested
      if (autoPrint) {
        // Wait a bit for content to render before printing
        setTimeout(() => {
          window.print();
        }, 500);
      }
    } catch (error) {
      showError('Unable to load enrollment form. The form may not exist or you may not have permission to view it.');
    }
  } else {
    // No form ID - show with fake data for demo
    showMainContent();
    fillAll(fakeData);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnPrint")?.addEventListener("click", () => window.print());
  
  // Initialize the form (will load from API if formId is in URL)
  initializeForm();
});

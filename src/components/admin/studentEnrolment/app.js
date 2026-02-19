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
function fillPage14(d){
  const p = d.page14 || {};

  // payment method checkbox (single select)
  setChecks("p14PayMethod", p.payMethod);

  // bank details
  setText("p14AccountName", p.accountName);
  setText("p14Bsb", p.bsb);
  setText("p14AccountNo", p.accountNo);
  setFillLine("p14TxnDesc", p.txnDesc);

  // submission section
  setText("p14Address", p.submission?.address);
  setText("p14Email", p.submission?.email);
  setText("p14Phone", p.submission?.phone);
}
function fillPage15(d){
  const p = d.page15 || {};

  // Example: multi-select acknowledgements (optional)
  // Requires HTML like: <span class="cb" data-check="p15Ack" data-value="agreeTerms"></span>
  setMultiChecks("p15Ack", p.acknowledgements);

  // Example: name/sign/date lines (optional)
  setFillLine("p15StudentName", p.studentName);
  setFillLine("p15Signature", p.signature);
  setFillLine("p15Date", p.date);
}


/* ===== Page 6 data + fill ===== */
fakeData.page6 = {
  units: [
    "CPCCBC4002",
    "CPCCDE3020",
    "CPCCBC4012",
    "HLTAID011",
    "RIISS00054"
  ]
};

function fillPage6(d){
  const p = d.page6 || {};
  setMultiChecks("p6Units", p.units);
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnPrint")?.addEventListener("click", () => window.print());
  fillAll(fakeData);
});

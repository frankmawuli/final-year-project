export const LOCATIONS = ["Nigeria", "Ghana", "Kenya", "South Africa"];

export const QUALIFICATIONS = ["Degree", "Diploma", "Masters", "PhD", "High School"];

export const JOB_FUNCTIONS = [
  "Accounting, Auditing & Finance",
  "Engineering",
  "Sales & Marketing",
  "Human Resources",
];

export const WORK_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 51 }, (_, i) => String(CURRENT_YEAR - i));

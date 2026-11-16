// Configuration for the "Real or AI?" classroom page.
// ENDPOINT: the Google Apps Script web app URL (ends in /exec). Leave empty for a local demo
// mode in which nothing is sent anywhere.
window.RA_CONFIG = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbwBY0pyXeUxaYGpUm8aLCNU5bv5LhkSf4z2680mwZlwxF0-cq1tx5lYQCmjtF0t4sKE/exec",
  // Default cohort label. A cohort keeps one session's data apart from another (e.g. test runs).
  // Override in the URL with ?cohort=test
  COHORT: "class12",
};

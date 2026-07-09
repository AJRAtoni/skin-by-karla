const SPREADSHEET_ID = "10SmnN7GsK7GlG8e_h4krw8YC9QhSKb_quQIQRwLyhTg";
const SHEET_NAME = "Subscribers";
const HEADERS = ["Submitted At", "Email"];

function doGet() {
  return jsonResponse_({ ok: true, message: "Skin by Karla signup endpoint" });
}

function doPost(event) {
  const data = event.parameter || {};

  if (data.website) {
    return jsonResponse_({ ok: true, skipped: true });
  }

  const email = String(data.email || "")
    .trim()
    .toLowerCase();

  if (!isValidEmail_(email)) {
    return jsonResponse_({ ok: false, error: "Invalid email" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      data.submittedAt ? new Date(data.submittedAt) : new Date(),
      email,
    ]);
  } finally {
    lock.releaseLock();
  }

  return jsonResponse_({ ok: true });
}

function getSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  return (
    spreadsheet.getSheetByName(SHEET_NAME) ||
    spreadsheet.insertSheet(SHEET_NAME)
  );
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every(
    (header, index) => firstRow[index] === header,
  );

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

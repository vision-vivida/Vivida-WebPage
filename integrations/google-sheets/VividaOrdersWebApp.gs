const SHEET_NAME = 'Orders';

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeader_(sheet);
  return sheet;
}

function ensureHeader_(sheet) {
  const header = [
    'Timestamp', 'Order ID', 'Created At',
    'Customer Name', 'Customer Email', 'Customer Phone', 'Customer Address',
    'Item Name', 'Size', 'Quantity', 'Unit Price (INR)', 'Total (INR)', 'Payment Method', 'Image URL', 'Status'
  ];
  const firstRow = sheet.getRange(1, 1, 1, header.length).getValues()[0];
  const isEmpty = firstRow.every(v => v === '');
  if (isEmpty) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
  }
}

function parseJsonBody_(e) {
  try {
    if (e && e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
  } catch (err) {
    Logger.log('JSON parse error: ' + err);
  }
  return null;
}

function toRow_(order) {
  const ts = new Date();
  const createdAt = order.createdAt ? new Date(order.createdAt) : ts;
  return [
    ts,
    order.orderId || '',
    createdAt,
    order.customer?.fullName || '',
    order.customer?.email || '',
    order.customer?.phone || '',
    order.customer?.address || '',
    order.item?.name || 'Poster',
    order.size || order.item?.size || 'A4',
    order.quantity || 1,
    order.item?.price || '',
    order.totalINR || '',
    order.payment || '',
    order.item?.src || '',
    order.status || 'Received'
  ];
}

function doPost(e) {
  const data = parseJsonBody_(e);
  if (!data) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const sheet = getOrCreateSheet_();
    const row = toRow_(data);
    sheet.appendRow(row);

    const out = { ok: true };
    return ContentService.createTextOutput(JSON.stringify(out))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const out = { ok: false, error: String(err) };
    return ContentService.createTextOutput(JSON.stringify(out))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  // Health check endpoint
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
} 
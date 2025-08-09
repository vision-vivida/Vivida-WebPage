# Vivida Orders → Google Sheets Web App

This folder contains a Google Apps Script web app that appends orders to a Google Sheet via HTTP POST.

## Files
- `VividaOrdersWebApp.gs`: Apps Script code with `doPost` handler.

## Setup Steps
1) Create a new Google Sheet (e.g., "Vivida Orders").
2) Open Extensions → Apps Script to create a bound Apps Script project.
3) In the Script Editor, create a file named `VividaOrdersWebApp.gs` and paste the code from this folder.
4) Save the project.
5) Deploy → Manage Deployments → New deployment:
   - Select type: Web app
   - Description: Vivida Orders Webhook
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy and Authorize when prompted
6) Copy the Web app URL (this is your webhook endpoint).
7) In your project, edit `assets/js/config.js` and set:

```js
window.VIVIDA_CONFIG = {
  SHEETS_WEBHOOK_URL: 'PASTE_YOUR_WEB_APP_URL_HERE',
  UPI: { vpa: 'your-vpa@bank', payeeName: 'Vivida' }
};
```

8) Test: load `order.html` in your browser, place a test order, and verify a new row appears in your Google Sheet.

## Data Columns
On first run, the script ensures headers:
- Timestamp, Order ID, Created At, Customer Name, Customer Email, Customer Phone, Customer Address,
  Item Name, Size, Quantity, Unit Price (INR), Total (INR), Payment Method, Image URL, Status

## Notes
- If you redeploy, replace the URL in `assets/js/config.js`.
- If you want to store in a different sheet/tab, change `SHEET_NAME` at the top of the `.gs` file.
- For private-only access, set "Who has access" to "Only me" and proxy requests via your own backend. 
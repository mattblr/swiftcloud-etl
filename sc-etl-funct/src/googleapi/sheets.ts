const { google } = require("googleapis");

const sheets = google.sheets({ version: "v4", auth: process.env["GOOGLEAPI"] });

export const sheetsAPI = async () => {
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: "1iNGwJWu4ghwM_jP3U81SRU9oneYqN4DTjW7j9t3lMh8",
    range: "Sheet1!A:H",
  });

  return data.data.values;
};

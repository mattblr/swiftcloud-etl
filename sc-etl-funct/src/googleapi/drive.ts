const { google } = require("googleapis");

const drive = google.drive({
  version: "v3",
  auth: process.env["GOOGLEAPI"],
});

export const driveAPI = async () => {
  const fileInfo = await drive.files.get({
    fileId: "1iNGwJWu4ghwM_jP3U81SRU9oneYqN4DTjW7j9t3lMh8",
    fields: "modifiedTime",
  });

  return fileInfo.data.modifiedTime;
};

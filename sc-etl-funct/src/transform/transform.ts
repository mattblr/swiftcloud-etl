const Listen = require("../models/listen");

export const transformData = (sheetData: Array<String>) => {
  const res = sheetData.map((row: any) => {
    return new Listen({
      song: row[0].replace("\n", " "),
      artist: row[1].replace("\n", " "),
      writer: row[2].split("\n"),
      album: row[3].replace("\n", " "),
      year: row[4],
      plays: [
        {
          date: sheetData[0][5].split("- ")[1],
          plays: row[5],
        },
        {
          date: sheetData[0][6].split("- ")[1],
          plays: row[6],
        },
        {
          date: sheetData[0][7].split("- ")[1],
          plays: row[7],
        },
      ],
    });
  });

  res.shift();
  return res;
};

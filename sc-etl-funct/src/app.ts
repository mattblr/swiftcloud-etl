const { driveAPI } = require("./googleapi/drive");
const { sheetsAPI } = require("./googleapi/sheets");
const { transformData } = require("./transform//transform");
const Modified = require("./models/modified");
const mongoose = require("mongoose");
const Listen = require("./models/listen");

mongoose.connect(
  `mongodb+srv://${process.env["MONGO_USER"]}:${process.env["MONGO_PASSWORD"]}@cluster0-buzuz.azure.mongodb.net/${process.env["MONGO_DB"]}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

export const etlApp = async () => {
  const fileModified = await driveAPI();

  const latestModifiedDate = await Modified.findOne({}).sort({
    modifiedDate: -1,
  });

  console.log("Checking to see if the data has changed...");
  if (!latestModifiedDate || fileModified > latestModifiedDate.modifiedDate) {
    console.log(
      `Data has been updated (${fileModified}) since last ETL write execution (${latestModifiedDate})`
    );

    if (!latestModifiedDate) {
      const modifiedDate = new Modified({
        modifiedDate: fileModified,
        executionDate: new Date(),
      });

      await modifiedDate.save();
    } else {
      await latestModifiedDate.updateOne({
        $set: {
          modifiedDate: fileModified,
          executionDate: new Date(),
        },
      });
    }

    const sheetData = await sheetsAPI();

    const transformedData = transformData(sheetData);

    await Listen.deleteMany();
    console.log("Saving da-tay-tay");
    Promise.all(
      transformedData.map((listen) => {
        listen.save();
      })
    );
    console.log(`All done. ${transformedData.length} rows added`);
  } else {
    await latestModifiedDate.updateOne({
      $set: {
        executionDate: new Date(),
      },
    });
    console.log(`No changes since ${fileModified}`);
  }
};

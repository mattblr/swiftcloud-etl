import { AzureFunction, Context } from "@azure/functions";

import { etlApp } from "./src/app";

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log("Timer function is running late!");
  }

  await etlApp();
  context.log("Timer trigger function ran!", timeStamp);
};

export default timerTrigger;

const express = require("express");
const slackData = require("./slack-data");
const cache = require("./cache");
const { channelSort, getAllChannels } = slackData;
const app = express();

app.get("/", cache(500), async (_, res) => {
  const channels = await getAllChannels();
  const sorted = await channelSort(channels);
  const resp = {
    data: sorted,
    channelTotal: sorted.length
  };
  res.send(resp);
});

const start = port => {
  console.log("starting server");
  app.listen(port);
  console.log(`server listening on ${port}`);
};

module.exports = { start };
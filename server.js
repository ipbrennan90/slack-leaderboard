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

app.post("/", (req, res) => {
  console.log(req.body.response_url);
  resp = {
    response_type: "in_channel",
    text: "Getting your leaderboard ready, get pump'd"
  };
  res.send(resp);
});

const start = port => {
  console.log("starting server");
  app.listen(port);
  console.log(`server listening on ${port}`);
};

module.exports = { start };

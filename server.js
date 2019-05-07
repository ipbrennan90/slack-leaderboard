const express = require("express");
const slackData = require("./slack-data");
const cache = require("./cache");
const { channelSort, getAllChannels } = slackData;
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
  console.log(req.body);
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

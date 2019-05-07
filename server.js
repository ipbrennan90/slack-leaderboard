const express = require("express");
const slackData = require("./slack-data");
const cache = require("./cache");
const axios = require("axios");
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
  sendLeaderBoard(req.body.response_url);
  resp = {
    response_type: "in_channel",
    text: "Getting your leaderboard ready, get pump'd"
  };
  res.send(resp);
});

async function sendLeaderBoard(respUrl) {
  const channels = await getAllChannels();
  const sorted = await channelSort(channels);
  const top_ten = sorted.slice(0, 10);
  const attachments = top_ten.map(channelRoyalty => {
    const text = `${channelRoyalty.rank + 1}. ${channelRoyalty.name} @ ${
      channelRoyalty.channelCount
    }`;
    return { text };
  });
  console.log("sending leaderboard!");
  axios({
    method: "post",
    url: respUrl,
    headers: {
      "Content-type": "application/json"
    },
    data: {
      response_type: "in_channel",
      text: "Today's leaderboard:",
      attachments
    }
  });
}

const start = port => {
  console.log("starting server");
  app.listen(port);
  console.log(`server listening on ${port}`);
};

module.exports = { start };

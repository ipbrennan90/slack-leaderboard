const express = require("express");
const slackData = require("./slack-data");
const cache = require("./cache");
const axios = require("axios");
const { channelSort, getAllChannels, channelsForCreator } = slackData;
const { getUser } = require("./slack-api");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", cache(86400), async (_, res) => {
  const channels = await getAllChannels();
  const sorted = await channelSort(channels);
  const resp = {
    data: sorted,
    channelTotal: sorted.length
  };
  res.send(resp);
});

app.get("/users/:userId", cache(86400), async (req, res) => {
  const userId = req.params.userId;
  const user = await getUser(userId);
  const channels = await getAllChannels();
  const userChannels = channelsForCreator(userId, channels);
  const response = {
    data: { ...user, channels: userChannels }
  };
  res.send(response);
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
  app.listen(port);
  console.log(`server listening on ${port}`);
};

module.exports = { start };

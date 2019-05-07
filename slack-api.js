var axios = require("axios");

async function getUser(id) {
  var url = `https://slack.com/api/users.profile.get?user=${id}`;

  const resp = await axios({
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.VIGE_TOKEN}`
    },
    method: "get",
    baseUrl: url
  });
  return resp.data;
}

async function getChannels(nextCursor = null) {
  var url = `https://slack.com/api/conversations.list?token=${
    process.env.VIGE_TOKEN
  }`;
  if (nextCursor) {
    url = url + "&cursor=" + nextCursor;
  }
  return axios({
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.VIGE_TOKEN}`
    },
    method: "get",
    baseUrl: url
  });
}

module.exports = { getUser, getChannels };

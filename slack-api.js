var axios = require("axios");

async function getUser(id = "U03G2NCNG") {
  var url = `https://slack.com/api/users.profile.get?token=${
    process.env.VIGE_TOKEN
  }=${id}`;

  const resp = await axios.get(url);
  return resp.data;
}

async function getChannels(nextCursor = null) {
  var url = `https://slack.com/api/conversations.list?token=${
    process.env.VIGE_TOKEN
  }`;
  if (nextCursor) {
    url = url + "&cursor=" + nextCursor;
  }
  return axios.get(url);
}

module.exports = { getUser, getChannels };

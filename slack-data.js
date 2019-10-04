const slackApi = require("./slack-api");

const { getChannels, getUser } = slackApi;

function channelCreators(channels) {
  const creators = [];
  channels.forEach(channel => {
    if (!creators.includes(channel.creator)) {
      creators.push(channel.creator);
    }
  });
  return creators;
}

function buildCreatorFrom(name, creatorChannels, creatorId) {
  const channelCount = creatorChannels.length;
  return {
    id: creatorId,
    rank: null,
    name,
    channelCount,
    channels: creatorChannels
  };
}

async function getAllChannels(nextCursor = null) {
  var allChannels = await getChannels(nextCursor);
  var nextCursor = allChannels.data.response_metadata.next_cursor;
  if (nextCursor) {
    try {
      return allChannels.data.channels.concat(await getAllChannels(nextCursor));
    } catch (e) {
      console.log(e);
    }
  } else {
    return allChannels.data.channels;
  }
}

function buildUserSortableChannelsArray(creators) {
  return Promise.all(
    creators.map(async creator => {
      try {
        const creatorResp = await getUser(creator.creator);
        const name = creatorResp && creatorResp.profile.real_name;
        return buildCreatorFrom(name, creator.channels, creator.creator);
      } catch (e) {
        console.log(e);
      }
    })
  );
}

function channelsForCreator(creatorId, channels) {
  return channels
    .filter(channel => channel.creator === creatorId)
    .map(channel => channel.name);
}

async function channelSort(channels) {
  const creators = channelCreators(channels);
  const creatorChannels = creators.map(creator => ({
    creator,
    channels: channelsForCreator(creator, channels)
  }));

  creatorChannels.sort((a, b) => b.channels.length - a.channels.length);

  let sortable = await buildUserSortableChannelsArray(creatorChannels);

  sortedWithRank = sortable.map((item, index) => ({ ...item, rank: index }));

  return sortedWithRank;
}

module.exports = { getAllChannels, channelSort, channelsForCreator };

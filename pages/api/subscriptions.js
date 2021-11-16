import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(400).json({ code: "unknown" });

  const { userChannelId } = req.query;

  const subscriptions = await getUserSubscriptions(userChannelId);

  const channels = subscriptions.map((subscription) =>
    makeChannel(subscription)
  );

  res.status(200).json(channels);
}

async function getUserSubscriptions(userChannelId) {
  let subscriptions = [];
  let pageToken;

  const params = {
    part: "snippet",
    channelId: userChannelId,
    maxResults: 50,
    fields:
      "(nextPageToken, items(id, snippet(title,resourceId/channelId,channelId,thumbnails/default)))",
    key: process.env.YOUTUBE_API_KEY,
  };
  do {
    const { data } = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/subscriptions",
      {
        params: !!pageToken ? { ...params, pageToken: pageToken } : params,
      }
    );
    const { nextPageToken, ...restData } = data;
    pageToken = nextPageToken;
    subscriptions = [...subscriptions, ...restData.items];
  } while (!!pageToken);

  return subscriptions;
}

function makeChannel(subscription) {
  return Object.freeze({
    id: subscription.snippet.resourceId.channelId,
    title: subscription.snippet.title,
    thumbnailUrl: subscription.snippet.thumbnails.default.url,
    lastAccess: new Date().toISOString(),
  });
}

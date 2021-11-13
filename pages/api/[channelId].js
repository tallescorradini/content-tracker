import axios from "axios";

export default async function handler(req, res) {
  if (!(req.method === "GET")) return;
  const { channelId, publishedAfter } = req.query;

  try {
    const { data } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/activities`,
      {
        params: {
          part: "snippet, contentDetails",
          channelId: channelId,
          maxResults: 50,
          order: "date",
          publishedAfter: publishedAfter,
          fields:
            "(items(id,snippet(publishedAt,channelId,title,thumbnails/default),contentDetails/upload/videoId),nextPageToken,pageInfo/totalResults)",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.status(200).json(makeChannelActivities(data));
  } catch (error) {
    res.status(400).json({ code: "unknown" });
  }
}

function makeActivityItems(items = []) {
  return items.map((item) => ({
    id: item.id,
    channelId: item.snippet.channelId,
    videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails.upload?.videoId}`,
    publishedAt: item.snippet.publishedAt,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.default.url,
  }));
}

function makeChannelActivities(data) {
  return {
    activities: makeActivityItems(data.items),
  };
}

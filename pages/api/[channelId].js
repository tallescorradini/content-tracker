import axios from "axios";

export default async function handler(req, res) {
  if (!(req.method === "GET")) return;
  const { channelId, publishedAfter } = req.query;

  try {
    const { data } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/activities`,
      {
        params: {
          part: "snippet",
          channelId: channelId,
          maxResults: 1,
          order: "date",
          publishedAfter: publishedAfter,
          fields: "pageInfo/totalResults",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.status(200).json({ totalNotifications: data.pageInfo.totalResults });
  } catch (error) {
    res.status(400).json({ code: "unknown" });
  }
}

import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import styles from "./FavoriteChannel.module.css";
import { useFavorites } from "../../../contexts/favorites-context";
import { ButtonLink } from "../../../components/ButtonLink/ButtonLink";
import { useEffect, useState } from "react";

export default function FavoriteChannel() {
  const router = useRouter();
  const [channel, setChannel] = useState();
  const { getChannel, notifications, onAccessNewActivity } = useFavorites();

  useEffect(() => {
    const channelId = router.query.channelId;
    if (!channelId) return;

    setChannel(getChannel(channelId));
  }, [router, getChannel]);

  return (
    <div className={styles.page}>
      <Head>
        <title>Notifications</title>
        <meta name="description" content="Channel's notifications" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <header className={styles.containerHeader}>
          <ButtonLink href={"/favorites"} variant="neutral">{`<`}</ButtonLink>
          <h2 className={styles.title}>Notifications</h2>
        </header>
        {channel ? (
          <section>
            <section className={styles.section}>
              <div className={styles.channel}>
                <Image
                  src={channel.thumbnail.url}
                  alt="Channel thumbnail"
                  width={channel.thumbnail.width}
                  height={channel.thumbnail.height}
                  className={styles.channelImage}
                />

                <p className={styles.channelName} style={{ marginTop: "1rem" }}>
                  {channel.title}
                </p>
              </div>
            </section>
            <section className={styles.section}>
              <header>
                <h3 className={styles.sectionTitle}>New</h3>
              </header>
              {!!notifications[channel.id].totalNotifications ? (
                <ul
                  className={styles.newChannelActivityList}
                  style={{ marginTop: "1rem" }}
                >
                  {notifications[channel.id]?.activities.map((activity) => (
                    <li key={activity.id} style={{ marginTop: "1rem" }}>
                      <a
                        onClick={() => onAccessNewActivity(activity)}
                        href={activity.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.channelActivity}
                      >
                        <img
                          src={activity.thumbnail.url}
                          alt="activity thumbnail"
                          width={activity.thumbnail.width}
                          height={activity.thumbnail.height}
                          className={styles.activityThumbnail}
                        />
                        <h4 className={styles.activityTitle}>
                          {activity.title}
                        </h4>
                        <span className={styles.activityPublishedDate}>
                          {new Date(activity.publishedAt).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Empty list</p>
              )}
              {/* {notifications[channel.id]?.totalNotifications > 3 ? (
                <button>Load More</button>
              ) : null} */}
            </section>
            {/* <section className={styles.section}>
              <header>
                <h3>Watched</h3>
              </header>
              <ul>
                {[1, 2, 3].map((item) => (
                  <li>item</li>
                ))}
              </ul>
            </section> */}
          </section>
        ) : null}
      </main>
    </div>
  );
}

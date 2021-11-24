import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./FavoriteChannel.module.css";
import { useFavorites } from "../../../contexts/favorites-context";
import { withAuth } from "../../../contexts/auth-context";
import { ButtonLink } from "../../../components/ButtonLink/ButtonLink";

function FavoriteChannel() {
  const router = useRouter();
  const [channel, setChannel] = useState();
  const { getChannel, notifications, onAccessNewActivity } = useFavorites();
  const { t } = useTranslation("favoriteChannelPage");

  function getTimeSincePublished(publishedAt) {
    if (!publishedAt) return;

    const publishedDate = new Date(publishedAt);
    const todaysDate = new Date();
    const differenceInMilliseconds =
      todaysDate.getTime() - publishedDate.getTime();

    const HOUR_IN_MILLISECONDS = 3600000;
    const wholeHoursSincePublished = Math.floor(
      differenceInMilliseconds / HOUR_IN_MILLISECONDS
    );
    if (wholeHoursSincePublished === 0) return t("Less than an hour ago");
    if (wholeHoursSincePublished === 1) return "1 hour ago";
    if (wholeHoursSincePublished < 24)
      return `${wholeHoursSincePublished} ${t("hours ago")}`;

    const DAY_IN_MILLISECONDS = 86400000;
    const wholeDaysSincePublished = Math.floor(
      differenceInMilliseconds / DAY_IN_MILLISECONDS
    );
    if (wholeDaysSincePublished === 1) return t("Yesterday");
    if (wholeDaysSincePublished > 1)
      return t("# days ago", { total: wholeDaysSincePublished });
  }

  useEffect(() => {
    const channelId = router.query.channelId;
    if (!channelId) return;

    setChannel(getChannel(channelId));
  }, [router, getChannel]);

  return (
    <div className={styles.page}>
      <Head>
        <title>{t("Notifications")}</title>
        <meta name="description" content={t("Channel's notifications")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <header className={styles.containerHeader}>
          <ButtonLink href={"/favorites"} variant="neutral">{`<`}</ButtonLink>
          <h2 className={styles.title}>{t("Notifications")}</h2>
        </header>
        {channel ? (
          <section>
            <section className={styles.section}>
              <div className={styles.channel}>
                <Image
                  src={channel.thumbnailUrl}
                  alt={t("Channel thumbnail")}
                  width="80px"
                  height="80px"
                  className={styles.channelImage}
                />

                <p className={styles.channelName} style={{ marginTop: "1rem" }}>
                  {channel.title}
                </p>
              </div>
            </section>
            <section className={styles.section}>
              <header>
                <h3 className={styles.sectionTitle}>{t("New")}</h3>
              </header>
              {!!notifications[channel.id]?.totalNotifications ? (
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
                          src={activity.thumbnailUrl}
                          alt={t("Channel activity thumbnail")}
                          width="80px"
                          height="80px"
                          className={styles.activityThumbnail}
                        />
                        <h4 className={styles.activityTitle}>
                          {activity.title}
                        </h4>
                        <span className={styles.activityPublishedDate}>
                          {getTimeSincePublished(activity.publishedAt)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t("List is empty")}</p>
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

export default withAuth({ privateRoute: true })(FavoriteChannel);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["favoriteChannelPage"])),
  },
});

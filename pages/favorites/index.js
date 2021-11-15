import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Favorites.module.css";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";
import { Button } from "../../components/Button/Button";
import { useFavorites } from "../../contexts/favorites-context";
import { useAuth } from "../../contexts/auth-context";

export default function FavoritesPage() {
  const router = useRouter();
  const { folders, onAccessChannel, notifications } = useFavorites();
  const { userId, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>My Favorites</title>
        <meta name="description" content="Favorite's pannel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div>
          <h1 style={{ display: "inline-block", margin: "0" }}>My Favorites</h1>
          <ButtonLink
            href="/add"
            variant="primary"
            style={{
              marginLeft: "2rem",
              maxHeight: "2rem",
              padding: "0.5rem 1.5rem",
            }}
          >
            Add
          </ButtonLink>
        </div>

        <Button onClick={handleLogout} variant="neutral">
          Logout
        </Button>
      </header>

      <main>
        {!userId ? (
          <section
            role="alert"
            className={styles.alert}
            style={{ marginTop: "2rem" }}
          >
            <p>
              Make sure to sign up or all progress will be lost when you leave
              the page.
            </p>
            <ButtonLink href="/signup" variant="secondary">
              Sign up
            </ButtonLink>
          </section>
        ) : null}

        {[...folders].reverse().map((folder) => (
          <section
            key={folder.name}
            className={styles.folder}
            style={{ marginTop: "6rem" }}
          >
            <header className={styles.folderHeader}>
              <h2 clasname={styles.folderTitle}>{folder.name}</h2>
              {folder.name !== "Uncategorized" ? (
                <ButtonLink href={`/edit/${folder.slug}`} variant="neutral">
                  Edit
                </ButtonLink>
              ) : null}
            </header>

            <ul className={styles.channelList}>
              {folder.channels?.length < 1 ? (
                <li className={styles.channel}>List is empty</li>
              ) : (
                folder.channels?.map((channel) => (
                  <li key={channel.id} className={styles.channel}>
                    <Link href={`favorites/${channel.id}`} passHref>
                      <div>
                        <div>
                          <Image
                            src={channel.thumbnailUrl}
                            alt="Channel thumbnail"
                            width="80px"
                            height="80px"
                            className={styles.channelImage}
                          />
                          {!!notifications[channel.id]?.totalNotifications ? (
                            <span className={styles.badge}>
                              {notifications[channel.id].totalNotifications > 9
                                ? "9+"
                                : notifications[channel.id].totalNotifications}
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={styles.channelName}
                          style={{ marginTop: "0.5rem" }}
                        >
                          {channel.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

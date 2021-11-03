import Head from "next/head";
import Image from "next/image";

import styles from "./Favorites.module.css";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink.jsx";
import { useFavorites } from "../../contexts/favorites-context";

export default function FavoritesPage() {
  const { folders } = useFavorites();

  return (
    <div className={styles.page}>
      <Head>
        <title>My Favorites</title>
        <meta name="description" content="Favorite's pannel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>My Favorites</h1>
        <ButtonLink href="/new" variant="primary">
          Add
        </ButtonLink>
      </header>

      <main>
        <section
          role="alert"
          className={styles.alert}
          style={{ marginTop: "2rem" }}
        >
          <p>
            Make sure to sign up or all progress will be lost when you leave the
            page.
          </p>
          <ButtonLink href="/signup" variant="secondary">
            Sign up
          </ButtonLink>
        </section>

        {folders.map((folder) => (
          <section
            key={folder.name}
            className={styles.folder}
            style={{ marginTop: "6rem" }}
          >
            <header className={styles.folderHeader}>
              <h2 clasname={styles.folderTitle}>{folder.name}</h2>
              <ButtonLink href={`/edit/${folder.slug}`} variant="neutral">
                Edit
              </ButtonLink>
            </header>

            <ul className={styles.channelList}>
              {folder.channels.length < 1 ? (
                <li className={styles.channel}>List is empty</li>
              ) : (
                folder.channels?.map((channel) => (
                  <li key={channel.id} className={styles.channel}>
                    <a href={channel.url} target="_blank" rel="noreferrer">
                      <div>
                        <Image
                          src={channel.thumbnail.url}
                          alt="Channel thumbnail"
                          width={channel.thumbnail.width}
                          height={channel.thumbnail.height}
                        />
                        {channel.notification ? (
                          <span className={styles.badge}></span>
                        ) : null}
                        <p
                          className={styles.channelName}
                          style={{ marginTop: "0.5rem" }}
                        >
                          {channel.title}
                        </p>
                      </div>
                    </a>
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

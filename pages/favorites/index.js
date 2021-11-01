import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

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
          Add Folder
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
              <ButtonLink href="/edit/all" variant="neutral">
                Edit
              </ButtonLink>
            </header>

            <ul className={styles.channelList}>
              {folder.channels?.map((channel) => (
                <li key={channel.id} className={styles.channel}>
                  <Link href={channel.url} passHref>
                    <div>
                      <Image
                        src={channel.thumbnail.url}
                        alt="Channel thumbnail"
                        width={channel.thumbnail.width}
                        height={channel.thumbnail.height}
                      />
                      <p
                        className={styles.channelName}
                        style={{ marginTop: "0.5rem" }}
                      >
                        {channel.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

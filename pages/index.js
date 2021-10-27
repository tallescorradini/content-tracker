import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Favorite Channels</title>
        <meta
          name="description"
          content="Organize your favorite Youtube channels"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Organize your favorite <br />
          Youtube channels
        </h1>

        {/* <Start/> */}
        {/* <Login/> */}
      </main>
    </div>
  );
}

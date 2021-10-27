import Head from "next/head";

import styles from "../styles/Home.module.css";
import { Box } from "../components/Box/Box";
import { Form } from "../components/Form/Form";
import { TextField } from "../components/TextField/TextField";
import { Button } from "../components/Button/Button";

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

        <Box style={{ width: "400px" }}>
          <h2 style={{ margin: "0 0 2rem 0" }}>
            Insert any Youtube channel URL to start
          </h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TextField label="URL" name="url" />

            <Button variant="primary" type="submit">
              Continue
            </Button>
          </Form>
        </Box>
        {/* <Login/> */}
      </main>
    </div>
  );
}

import Head from "next/head";
import { useRouter } from "next/router";
import useForm from "../hooks/useForm";
import * as yup from "yup";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import { Box } from "../components/Box/Box";
import { Form } from "../components/Form/Form";
import { TextField } from "../components/TextField/TextField";
import { Button } from "../components/Button/Button";
import { ButtonLink } from "../components/ButtonLink/ButtonLink";
import { Alert } from "../components/Alert/Alert";
import { useFavorites } from "../contexts/favorites-context";

const formFields = {
  userChannelId: {
    attribute: {
      name: "userChannelId",
      label: "Your Channel ID",
      type: "text",
    },
    initialValue: "",
    validation: yup.string().ensure().trim().required("Campo obrigatório"),
  },
};

const errorMessages = {
  invalid_id: "Desculpe, não encontramos o canal informado. ",
  unknown: "Desculpe, algo deu errado. ",
};

export default function Home() {
  const router = useRouter();
  const { subscribe, onSubmit, values } = useForm(yup);
  const [showAlert, setShowAlert] = useState({ message: "" });
  const { addUncategorizedFolder } = useFavorites();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addUncategorizedFolder(values.userChannelId);
      router.push({
        pathname: "/favorites",
      });
    } catch (error) {
      const errorCode = error.response?.data?.code;
      setShowAlert({
        message: errorMessages[errorCode] || errorMessages["unknown"],
      });
    }
  }

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

        <div>
          <Box style={{ display: "inline-block", width: "400px" }}>
            <h2 style={{ margin: "0 0 2rem 0" }}>
              Insert your Youtube channel ID to start
            </h2>

            {showAlert.message ? (
              <Alert
                message={showAlert.message}
                onDismiss={() => setShowAlert(false)}
                style={{ marginBottom: "2rem" }}
              />
            ) : null}

            <Form {...onSubmit(handleSubmit)}>
              <TextField {...subscribe(formFields.userChannelId)} />

              <Button variant="primary" type="submit">
                Continue
              </Button>
            </Form>
          </Box>

          <span style={{ margin: "0 4rem" }}>or</span>
          <ButtonLink href="/login" variant="secondary">
            Login
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}

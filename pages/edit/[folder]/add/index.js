import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import styles from "./AddChannel.module.css";
import useForm from "../../../../hooks/useForm";
import { useFavorites } from "../../../../contexts/favorites-context";
import { ButtonLink } from "../../../../components/ButtonLink/ButtonLink.jsx.jsx";
import { TextField } from "../../../../components/TextField/TextField.jsx";
import { Button } from "../../../../components/Button/Button.jsx";
import { Alert } from "../../../../components/Alert/Alert";

const formFields = {
  channelUrl: {
    attribute: {
      name: "url",
      label: "Url",
      type: "text",
    },
    initialValue: "",
    validation: yup
      .string()
      .ensure()
      .trim()
      .required("Campo obrigatório")
      .matches(/www.youtube.com\/c/, "URL fornecida é inválida"),
  },
};

const errorMessages = {
  invalid_id: "Desculpe, não encontramos o canal informado. ",
  unknown: "Desculpe, algo deu errado. ",
};

export default function AddChannel() {
  const router = useRouter();
  const { subscribe, onSubmit, values } = useForm(yup);
  const [showAlert, setShowAlert] = useState({ message: "" });
  const { addFavorite } = useFavorites();

  async function handleSubmit() {
    try {
      await addFavorite(values.url);
      router.push({
        pathname: `/edit/${router.query.folder}`,
      });
    } catch (error) {
      const errorCode = error.response.data?.code;
      setShowAlert({
        message: errorMessages[errorCode] || errorMessages["unknown"],
      });
    }
  }

  return (
    <div>
      <Head>
        <title>Add Channel</title>
        <meta name="description" content="Add a new channel to folder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink
              href={`/edit/${router.query.folder}`}
              variant="neutral"
            >{`<`}</ButtonLink>

            <h1 className={styles.title}>Add Channel</h1>
          </header>

          {showAlert.message ? (
            <Alert
              message={showAlert.message}
              onDismiss={() => setShowAlert(false)}
              style={{ marginBottom: "2rem" }}
            />
          ) : null}

          <form {...onSubmit(handleSubmit)}>
            <TextField
              {...subscribe(formFields.channelUrl)}
              style={{ marginBottom: "3rem" }}
            />
            <Button type="submit" variant="primary" fullWidth>
              Save
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

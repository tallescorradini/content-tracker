import Head from "next/head";
import { useRouter } from "next/router";
import useForm from "../hooks/useForm";
import * as yup from "yup";

import styles from "../styles/Home.module.css";
import { Box } from "../components/Box/Box";
import { Form } from "../components/Form/Form";
import { TextField } from "../components/TextField/TextField";
import { Button } from "../components/Button/Button";

const formFields = {
  url: {
    attribute: { name: "url", label: "Url", type: "text" },
    initialValue: "",
    validation: yup
      .string()
      .required("Campo obrigatório")
      .matches(/www.youtube.com\/c/, "URL fornecida é inválida"),
  },
};

export default function Home() {
  const router = useRouter();
  const { subscribe, onSubmit, values } = useForm(yup);

  function handleSubmit(e) {
    e.preventDefault();
    router.push({
      pathname: "/favorites",
      query: { url: values.url },
    });
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

        <Box style={{ width: "400px" }}>
          <h2 style={{ margin: "0 0 2rem 0" }}>
            Insert any Youtube channel URL to start
          </h2>
          <Form {...onSubmit(handleSubmit)}>
            <TextField {...subscribe(formFields.url)} />

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

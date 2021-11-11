import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import * as yup from "yup";

import styles from "./Login.module.css";
import { TextField } from "../../components/TextField/TextField";
import { Button } from "../../components/Button/Button";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";
import { Alert } from "../../components/Alert/Alert";
import useForm from "../../hooks/useForm";
import { useAuth } from "../../contexts/auth-context";

const formFields = {
  email: {
    attribute: { name: "email", label: "Email", type: "email" },
    initialValue: "",
    validation: yup
      .string()
      .ensure()
      .trim()
      .required("Campo obrigatório")
      .email("Email inválido"),
  },
  password: {
    attribute: { name: "password", label: "Password", type: "password" },
    initialValue: "",
    validation: yup
      .string()
      .ensure()
      .trim()
      .required("Campo obrigatório")
      .min(6, "Deve conter ao menos 6 caracteres"),
  },
};

const errorMessages = {
  "auth/wrong-password": "Desculpe, a conta ou senha informada é inválida. ",
  "auth/user-not-found": "Desculpe, a conta ou senha informada é inválida. ",
  "auth/too-many-requests": "Desculpe, o limite de tentativas foi excedido. ",
  "auth/network-request-failed":
    "Desculpe, cheque sua conexão e tente novamente. ",
  "auth/default": "Desculpe, algo deu errado. ",
};

export default function Login() {
  const router = useRouter();
  const { subscribe, onSubmit, values: formValues } = useForm(yup);
  const { login } = useAuth();
  const [showAlert, setShowAlert] = useState({ message: null });

  async function handleSubmit() {
    const { email, password } = formValues;
    const error = await login(email, password);

    if (error) {
      setShowAlert({
        message: errorMessages[error] || errorMessages["auth/default"],
      });
      return;
    }

    router.replace("/favorites");
  }

  return (
    <div>
      <Head>
        <title>{`Login`}</title>
        <meta name="description" content="Login form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink variant="neutral" href="/">{`<`}</ButtonLink>
            <h1 className={styles.title}>Login</h1>
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
              {...subscribe(formFields.email)}
              style={{ marginBottom: "1rem" }}
            />
            <TextField
              {...subscribe(formFields.password)}
              style={{ marginBottom: "1rem" }}
            />

            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: "1rem" }}
              fullWidth
            >
              Continue
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

import Head from "next/head";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./Signup.module.css";
import useForm from "../../hooks/useForm";
import { useAuth } from "../../contexts/auth-context";
import { TextField } from "../../components/TextField/TextField";
import { Button } from "../../components/Button/Button";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";
import { Alert } from "../../components/Alert/Alert";

export default function Signup() {
  const { signup } = useAuth({ restrictedRoute: true });
  const router = useRouter();
  const { subscribe, onSubmit, values: formValues } = useForm(yup);
  const [showAlert, setShowAlert] = useState({ message: null });
  const { t } = useTranslation("signupPage");

  const formFields = {
    email: {
      attribute: { name: "email", label: "Email", type: "email" },
      initialValue: "",
      validation: yup
        .string()
        .ensure()
        .trim()
        .required(t("Required field"))
        .email(t("Invalid email")),
    },
    password: {
      attribute: { name: "password", label: t("Password"), type: "password" },
      initialValue: "",
      validation: yup
        .string()
        .ensure()
        .trim()
        .required(t("Required field"))
        .min(6, t("Must be at least 6 characters long")),
    },
  };

  const errorMessages = {
    "auth/email-already-in-use": t("Sorry, this email is already being used."),
    "auth/network-request-failed": t(
      "Sorry, check your connection and try again."
    ),
    "auth/default": t("Sorry, something went wrong."),
  };

  async function handleSubmit() {
    const { email, password } = formValues;
    const error = await signup(email, password);

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
        <title>{t("Sign Up")}</title>
        <meta name="description" content={t("Signup form")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink variant="neutral" href="/favorites">{`<`}</ButtonLink>
            <h1 className={styles.title}>{t("Sign Up")}</h1>
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
              {t("Continue")}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["signupPage"])),
  },
});

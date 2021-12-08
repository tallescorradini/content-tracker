import Head from "next/head";
import * as yup from "yup";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./Login.module.css";
import useForm from "../../hooks/useForm";
import { useAuth, withAuth } from "../../contexts/auth-context";
import { TextField } from "../../components/TextField/TextField";
import { Button } from "../../components/Button/Button";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";
import { Alert } from "../../components/Alert/Alert";

function Login() {
  const { login } = useAuth();
  const { subscribe, onSubmit, values: formValues } = useForm(yup);
  const [showAlert, setShowAlert] = useState({ message: null });
  const { t } = useTranslation("loginPage");

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
    "auth/wrong-password": t("Sorry, invalid email or password."),
    "auth/user-not-found": t("Sorry, invalid email or password."),
    "auth/too-many-requests": t("Sorry, maximum login attempts exceeded."),
    "auth/network-request-failed": t(
      "Sorry, check your connection and try again."
    ),
    "auth/default": t("Sorry, something went wrong."),
  };

  async function handleSubmit() {
    const { email, password } = formValues;
    const error = await login(email, password, { redirectUri: "/favorites" });

    if (error) {
      setShowAlert({
        message: errorMessages[error] || errorMessages["auth/default"],
      });
      return;
    }
  }

  return (
    <div>
      <Head>
        <title>{t("Login")}</title>
        <meta name="description" content={t("Login form")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink variant="neutral" href="/">{`<`}</ButtonLink>
            <h1 className={styles.title}>{t("Login")}</h1>
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

export default withAuth({ restrictedRoute: true })(Login);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["loginPage"])),
  },
});

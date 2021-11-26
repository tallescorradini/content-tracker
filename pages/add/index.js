import Head from "next/head";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./AddFolder.module.css";
import useForm from "../../hooks/useForm";
import { useFavorites } from "../../contexts/favorites-context";
import { withAuth } from "../../contexts/auth-context";
import { TextField } from "../../components/TextField/TextField";
import { Button } from "../../components/Button/Button";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";

function Add() {
  const router = useRouter();
  const { addFolder } = useFavorites();
  const { subscribe, onSubmit, values, changed, resetField } = useForm(yup);
  const { t } = useTranslation("addFolderPage");

  const formFields = {
    folderName: {
      attribute: {
        name: "folderName",
        label: t("Name"),
        type: "text",
      },
      initialValue: "",
      validation: yup
        .string()
        .ensure()
        .trim()
        .required(t("Required field"))
        .matches(/^[\w ]+$/g, t("Must only contain letters and numbers")),
    },
  };

  async function handleSubmit() {
    const folder = await addFolder(
      values[formFields.folderName.attribute.name]
    );
    router.replace(`/edit/${folder.slug}`);
  }

  return (
    <div>
      <Head>
        <title>{t("Add Folder")}</title>
        <meta name="description" content={t("Page for creating a folder")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink variant="neutral" href="/favorites">{`<`}</ButtonLink>
            <h1 className={styles.title}>{t("Add Folder")}</h1>
          </header>

          <form {...onSubmit(handleSubmit)}>
            <TextField
              {...subscribe(formFields.folderName)}
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

export default withAuth({ privateRoute: true })(Add);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["addFolderPage"])),
  },
});

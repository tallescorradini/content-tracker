import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import * as yup from "yup";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./EditFolder.module.css";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import useForm from "../../../hooks/useForm";
import { useEffect, useState } from "react";
import { useFavorites } from "../../../contexts/favorites-context";
import { ButtonLink } from "../../../components/ButtonLink/ButtonLink";

export default function Folder() {
  const router = useRouter();
  const { getFolderBySlug, updateFolderName, removeFavorite, deleteFolder } =
    useFavorites();
  const { subscribe, onSubmit, values, changed, resetField } = useForm(yup);
  const [folder, setFolder] = useState();
  const [activeListItem, setActiveListItem] = useState(null);
  const [toggleOverlay, setToggleOverlay] = useState(false);
  const { t } = useTranslation("editFolderPage");

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

  function handleReturn() {
    router.push("/favorites");
  }

  function handleSubmit() {
    const { updatedSlug } = updateFolderName({
      oldName: formFields.folderName.initialValue,
      newName: values[formFields.folderName.attribute.name],
    });
    router.replace(`/edit/${updatedSlug}`);
  }

  function handleDiscard() {
    resetField(formFields.folderName.attribute.name);
  }

  function handleRemoveChannel(channel) {
    removeFavorite(channel, folder.name);
  }

  function handleDeleteFolder(folderName) {
    deleteFolder(folderName);
    router.replace(`/favorites`);
  }

  useEffect(() => {
    const slug = router.query.folder;
    if (!slug) return;
    if (router.query.folder === "uncategorized") {
      router.replace("/favorites");
    }

    const folder = getFolderBySlug(slug);

    setFolder(folder);
  }, [router, getFolderBySlug]);

  if (folder) formFields.folderName.initialValue = folder.name;

  return (
    <div>
      <Head>
        <title>{t("Edit Folder")}</title>
        <meta
          name="description"
          content={t("Page for editing folder details")}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <Button variant="neutral" onClick={handleReturn}>{`<`}</Button>
            <h1 className={styles.title}>{t("Edit Folder")}</h1>
          </header>

          <form {...onSubmit(handleSubmit)} style={{ marginBottom: "4rem" }}>
            <TextField
              {...subscribe(formFields.folderName)}
              style={{ marginBottom: "1rem" }}
            />
            {changed?.[formFields.folderName.attribute.name] ? (
              <div role="group" className={styles.buttonGroup}>
                <Button onClick={handleDiscard} variant="secondary">
                  {t("Discard")}
                </Button>
                <Button type="submit" variant="primary">
                  {t("Save")}
                </Button>
              </div>
            ) : null}
          </form>

          <section>
            <header
              className={styles.channelsHeader}
              style={{ marginBottom: "2rem" }}
            >
              <h2 className={styles.channelsTitle}>{t("Channels")}</h2>
              <ButtonLink
                href={`/edit/${router.query.folder}/add`}
                variant="primary"
              >
                {t("Add")}
              </ButtonLink>
            </header>
            <ul className={styles.channelsList}>
              {folder?.channels.length < 1 ? (
                <p>{t("List is empty")}</p>
              ) : (
                folder?.channels.map((channel) => (
                  <li
                    onMouseEnter={(e) => {
                      setActiveListItem(e["_targetInst"].key);
                    }}
                    onMouseLeave={() => setActiveListItem(null)}
                    key={channel.id}
                    style={{ marginBottom: "1rem" }}
                  >
                    <div className={styles.channel}>
                      <Image
                        src={channel.thumbnailUrl}
                        alt={t("Channel thumbnail")}
                        width={24}
                        height={24}
                      />
                      <span>{channel.title}</span>
                    </div>

                    {channel.id === activeListItem ? (
                      <Button
                        onClick={() => handleRemoveChannel(channel)}
                        variant="secondary"
                      >
                        Remove
                      </Button>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
            <Button
              onClick={() => setToggleOverlay(true)}
              variant="secondary"
              style={{ marginTop: "2rem" }}
              fullWidth
            >
              {t("Delete Folder")}
            </Button>
            {toggleOverlay ? (
              <div className={styles.deleteConfirmation}>
                <section className={styles.deleteContainer}>
                  <h2 className={styles.deleteHeading}>
                    {t(
                      "This action cannot be undone, do you really want to delete this folder?"
                    )}
                  </h2>
                  <Button
                    onClick={() => handleDeleteFolder(folder.name)}
                    variant="secondary"
                    style={{ marginTop: "2rem" }}
                    fullWidth
                  >
                    {t("Yes, delete this folder")}
                  </Button>
                  <Button
                    onClick={() => setToggleOverlay(false)}
                    variant="neutral"
                    style={{ marginTop: "1rem" }}
                    fullWidth
                  >
                    {t("No, return to folder")}
                  </Button>
                </section>
              </div>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["editFolderPage"])),
  },
});

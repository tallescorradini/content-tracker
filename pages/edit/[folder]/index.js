import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import * as yup from "yup";

import styles from "./EditFolder.module.css";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import useForm from "../../../hooks/useForm";
import { useEffect, useState } from "react";
import { useFavorites } from "../../../contexts/favorites-context";
import { ButtonLink } from "../../../components/ButtonLink/ButtonLink";

const formFields = {
  folderName: {
    attribute: {
      name: "folderName",
      label: "Name",
      type: "text",
    },
    initialValue: "",
    validation: yup
      .string()
      .ensure()
      .trim()
      .required("Campo obrigatório")
      .matches(/^[\w ]+$/g, "Deve conter somente letras e números"),
  },
};

export default function Folder() {
  const router = useRouter();
  const { getFolderBySlug, updateFolderName, removeFavorite, deleteFolder } =
    useFavorites();
  const { subscribe, onSubmit, values, changed, resetField } = useForm(yup);
  const [folder, setFolder] = useState();
  const [activeListItem, setActiveListItem] = useState(null);
  const [toggleOverlay, setToggleOverlay] = useState(false);

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

  function handleRemoveChannel(channelId) {
    removeFavorite(channelId, folder.name);
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
        <title>{`Edit Folder`}</title>
        <meta name="description" content="Page for editing folder details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <Button variant="neutral" onClick={handleReturn}>{`<`}</Button>
            <h1 className={styles.title}>Edit Folder</h1>
          </header>

          <form {...onSubmit(handleSubmit)} style={{ marginBottom: "4rem" }}>
            <TextField
              {...subscribe(formFields.folderName)}
              style={{ marginBottom: "1rem" }}
            />
            {changed?.[formFields.folderName.attribute.name] ? (
              <div role="group" className={styles.buttonGroup}>
                <Button onClick={handleDiscard} variant="secondary">
                  Discard
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            ) : null}
          </form>

          <section>
            <header
              className={styles.channelsHeader}
              style={{ marginBottom: "2rem" }}
            >
              <h2 className={styles.channelsTitle}>Channels</h2>
              <ButtonLink
                href={`/edit/${router.query.folder}/add`}
                variant="primary"
              >
                Add
              </ButtonLink>
            </header>
            <ul className={styles.channelsList}>
              {folder?.channels.length < 1 ? (
                <p>List is empty</p>
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
                        alt="Channel thumbnail"
                        width={24}
                        height={24}
                      />
                      <span>{channel.title}</span>
                    </div>

                    {channel.id === activeListItem ? (
                      <Button
                        onClick={() => handleRemoveChannel(channel.id)}
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
              Delete Folder
            </Button>
            {toggleOverlay ? (
              <div className={styles.deleteConfirmation}>
                <section className={styles.deleteContainer}>
                  <h2 className={styles.deleteHeading}>
                    This action cannot be undone, do you really want to delete
                    this folder?
                  </h2>
                  <Button
                    onClick={() => handleDeleteFolder(folder.name)}
                    variant="secondary"
                    style={{ marginTop: "2rem" }}
                    fullWidth
                  >
                    Yes, delete this folder
                  </Button>
                  <Button
                    onClick={() => setToggleOverlay(false)}
                    variant="neutral"
                    style={{ marginTop: "1rem" }}
                    fullWidth
                  >
                    No, return to folder
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

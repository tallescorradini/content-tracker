import { useRouter } from "next/router";
import Image from "next/image";
import * as yup from "yup";

import styles from "./EditFolder.module.css";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import useForm from "../../../hooks/useForm";
import { useEffect, useState } from "react";
import { useFavorites } from "../../../contexts/favorites-context";

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
      .required("Campo obrigatório")
      .min(6, "Deve conter ao menos 6 caracteres"),
  },
};

export default function Folder() {
  const router = useRouter();
  const { getFolderBySlug } = useFavorites();
  const { subscribe, onSubmit, values, changed } = useForm(yup);
  const [folder, setFolder] = useState();
  const [onEditName, setOnEditName] = useState(false);
  const [activeListItem, setActiveListItem] = useState(null);

  function handleReturn() {
    router.push("/favorites");
  }

  function handleSubmit() {
    //
    console.log("submitted");
  }

  function handleDiscard() {
    // resetFormValue
    setOnEditName(false);
  }

  useEffect(() => {
    const slug = router.query.folder;
    if (!slug) return;
    const folder = getFolderBySlug(slug);

    setFolder(folder);
  }, [router, getFolderBySlug]);

  if (folder) formFields.folderName.initialValue = folder.name;

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header
          className={styles.containerHeader}
          style={{ marginBottom: "3rem" }}
        >
          <Button variant="neutral" onClick={handleReturn}>{`<`}</Button>
          <h1 className={styles.title}>Edit folder</h1>
        </header>

        <form {...onSubmit(handleSubmit)} style={{ marginBottom: "4rem" }}>
          <TextField
            {...subscribe(formFields.folderName)}
            style={{ marginBottom: "1rem" }}
          />
          {onEditName ? (
            <div role="group" className={styles.buttonGroup}>
              <Button type="submit" variant="primary">
                Save
              </Button>
              <Button onClick={handleDiscard} variant="secondary">
                Discard
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
            <Button variant="primary">Add</Button>
          </header>
          <ul className={styles.channelsList}>
            {folder?.channels.map((channel) => (
              <li
                onMouseEnter={(e) => {
                  console.log(e["_targetInst"].key);
                  setActiveListItem(e["_targetInst"].key);
                }}
                onMouseLeave={() => setActiveListItem(null)}
                key={channel.id}
                style={{ marginBottom: "1rem" }}
              >
                <div className={styles.channel}>
                  <Image
                    src={channel.thumbnail.url}
                    alt="Channel thumbnail"
                    width={24}
                    height={24}
                  />
                  <span>{channel.title}</span>
                </div>

                {channel.id === activeListItem ? (
                  <Button variant="secondary">Remove</Button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

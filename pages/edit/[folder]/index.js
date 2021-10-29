import { useRouter } from "next/router";
import * as yup from "yup";

import styles from "./EditFolder.module.css";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import useForm from "../../../hooks/useForm";
import { useState } from "react";

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
  const { subscribe, onSubmit, values } = useForm(yup);
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
            {["1", "2", "3", "4"].map((channel) => (
              <li
                onMouseEnter={(e) => setActiveListItem(e["_targetInst"].key)}
                onMouseLeave={(e) => setActiveListItem(null)}
                key={channel}
                style={{ marginBottom: "1rem" }}
              >
                <span>Channel</span>
                {channel === activeListItem ? (
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

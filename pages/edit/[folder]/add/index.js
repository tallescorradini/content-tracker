import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./AddChannel.module.css";
import useForm from "../../../../hooks/useForm";
import { useFavorites } from "../../../../contexts/favorites-context";
import { useAuth } from "../../../../contexts/auth-context";
import { ButtonLink } from "../../../../components/ButtonLink/ButtonLink";
import { Button } from "../../../../components/Button/Button.jsx";

export default function AddChannel() {
  useAuth({ privateRoute: true });
  const router = useRouter();
  const { subscribe, onSubmit, values: formValues } = useForm(yup);
  const { folders, addFavorite, getFolderBySlug } = useFavorites();
  const [uncategorizedChannels, setUncategorizedChannels] = useState([]);
  const { t } = useTranslation("addChannelPage");

  function getChannelsToAdd(formValues) {
    return (
      Object.keys(formValues).filter(
        (fieldName) => formValues[fieldName] !== false
      ) || []
    );
  }

  async function handleSubmit() {
    const channels = getChannelsToAdd(formValues);
    const folder = getFolderBySlug(router.query.folder);

    if (channels.length < 1) {
      router.replace(`/edit/${folder.slug}`);
      return;
    }

    await addFavorite(channels, folder.name);
    router.push({
      pathname: `/edit/${folder.slug}`,
    });
  }

  useEffect(() => {
    if (folders.length < 1) return;

    const uncategorizedChannels = folders.filter(
      (folder) => folder.name === "Uncategorized"
    )[0]?.channels;

    if (!uncategorizedChannels) return;

    setUncategorizedChannels(uncategorizedChannels);
  }, [folders]);

  const formFields = uncategorizedChannels.reduce(
    (prev, channel) => ({
      ...prev,
      [channel.id]: {
        attribute: {
          id: channel.id,
          name: channel.id,
          label: channel.title,
          type: "checkbox",
        },
        initialValue: false,
        validation: yup.boolean(),
      },
    }),
    {}
  );

  return (
    <div>
      <Head>
        <title>{t("Add Channel")}</title>
        <meta name="description" content={t("Add a new channel to folder")} />
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

            <h1 className={styles.title}>{t("Add Channel")}</h1>
          </header>

          {uncategorizedChannels?.length < 1 ? (
            <p>{t("All uncategorized channels have already been selected")}</p>
          ) : (
            <form {...onSubmit(handleSubmit)}>
              <fieldset className={styles.channelsList}>
                <legend style={{ marginBottom: "1.5rem" }}>
                  {t("Choose channels to add to folder")}
                </legend>

                {uncategorizedChannels.map((channel) => (
                  <div key={channel.id} style={{ marginBottom: "1rem" }}>
                    <label htmlFor={channel.id} className={styles.channel}>
                      <input {...subscribe(formFields[channel.id])} />
                      <Image
                        src={channel.thumbnailUrl}
                        alt={t("Channel thumbnail")}
                        width={24}
                        height={24}
                      />
                      <span>{channel.title}</span>
                    </label>
                  </div>
                ))}
              </fieldset>

              <Button type="submit" variant="primary" fullWidth>
                {t("Save")}
              </Button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["addChannelPage"])),
  },
});

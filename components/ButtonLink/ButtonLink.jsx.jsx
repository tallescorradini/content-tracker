import Link from "next/link";

import styles from "./ButtonLink.module.css";

export function ButtonLink({ href, variant, children }) {
  return (
    <Link href={href} passHref>
      <button className={`${styles.button} ${styles[variant]}`}>
        {children}
      </button>
    </Link>
  );
}

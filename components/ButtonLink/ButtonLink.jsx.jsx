import Link from "next/link";

import styles from "./ButtonLink.module.css";

export function ButtonLink({ href, variant, style, children }) {
  return (
    <Link href={href} passHref>
      <button className={`${styles.button} ${styles[variant]}`} style={style}>
        {children}
      </button>
    </Link>
  );
}

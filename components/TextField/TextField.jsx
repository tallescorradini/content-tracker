import { IoIosHelpCircleOutline } from "react-icons/io";

import styles from "./TextField.module.css";

export function TextField({
  label = "",
  name,
  errors = [],
  children,
  style,
  helperLink,
  ...rest
}) {
  const hasError = errors.length > 0;

  return (
    <div className={styles.field} style={style}>
      <label htmlFor={name}>{label}</label>
      <a href={helperLink} target="_blank" rel="noreferrer">
        <IoIosHelpCircleOutline className={styles.helpIcon} />
      </a>
      <input name={name} id={name} type="text" {...rest} />
      {hasError ? (
        <ul className={styles.errorMessage}>
          {errors.map((e) => (
            <li key={e}>{`${e}. `}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

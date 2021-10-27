import styles from "./TextField.module.css";

export function TextField({ label, name, children, ...rest }) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <input name={name} id={name} type="text" {...rest} />
    </div>
  );
}

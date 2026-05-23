import styles from "./FieldnotesMark.module.css";

type FieldnotesMarkProps = {
  size?: "sm" | "md";
};

export function FieldnotesMark({ size = "md" }: FieldnotesMarkProps) {
  return (
    <span
      className={`${styles.mark} ${size === "sm" ? styles.sm : styles.md}`}
      aria-hidden="true"
    >
      <span className={styles.text}>FN</span>
      <span className={styles.dot} />
    </span>
  );
}

import type { ReferenceBlock } from "../data/types";
import { ReferencePanel } from "./ReferencePanel";
import styles from "./QuestionCard.module.css";

type QuestionCardProps = {
  label: string;
  title: string;
  subtitle?: string;
  reference?: ReferenceBlock;
};

export function QuestionCard({
  label,
  title,
  subtitle,
  reference,
}: QuestionCardProps) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h2 className={styles.title}>{title}</h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      {reference ? <ReferencePanel reference={reference} defaultOpen /> : null}
    </article>
  );
}

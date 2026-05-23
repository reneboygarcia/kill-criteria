import { Link } from "react-router-dom";
import type { OutcomeNode } from "../data/types";
import { ReferencePanel } from "./ReferencePanel";
import styles from "./OutcomeCard.module.css";

type OutcomeCardProps = {
  node: OutcomeNode;
  pathSummary?: string[];
  onCopy: () => void;
  onRestart: () => void;
  copyStatus: "idle" | "copied" | "error";
};

const variantClass = {
  stay: styles.stay,
  change: styles.change,
  exit: styles.exit,
};

export function OutcomeCard({
  node,
  pathSummary,
  onCopy,
  onRestart,
  copyStatus,
}: OutcomeCardProps) {
  return (
    <article className={`${styles.card} ${variantClass[node.variant]}`}>
      <p className={styles.label}>{node.label}</p>
      <h2 className={styles.title}>{node.title}</h2>
      <p className={styles.subtitle}>{node.subtitle}</p>

      {node.reference ? (
        <ReferencePanel reference={node.reference} defaultOpen />
      ) : null}

      {pathSummary && pathSummary.length > 0 ? (
        <details className={styles.pathRecap}>
          <summary>View your decision path</summary>
          <ol className={styles.pathList}>
            {pathSummary.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      ) : null}

      <div className={styles.actions}>
        {node.handoff ? (
          <Link
            to={`/flow/${node.handoff.flowId}`}
            className={styles.primaryAction}
          >
            {node.handoff.label}
          </Link>
        ) : null}
        <button type="button" className={styles.secondaryAction} onClick={onCopy}>
          {copyStatus === "copied"
            ? "Copied!"
            : copyStatus === "error"
              ? "Copy failed — try again"
              : "Copy my result"}
        </button>
        <button type="button" className={styles.secondaryAction} onClick={onRestart}>
          Start over
        </button>
        <Link to="/" className={styles.secondaryAction}>
          Back to hub
        </Link>
      </div>
    </article>
  );
}

import { Link } from "react-router-dom";
import type { OutcomeNode } from "../data/types";
import { ReferencePanel } from "./ReferencePanel";
import styles from "./OutcomeCard.module.css";

type PathStep = {
  index: number;
  label: string;
};

type OutcomeCardProps = {
  node: OutcomeNode;
  pathSteps?: PathStep[];
  onGoBack?: (stepIndex: number) => void;
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
  pathSteps,
  onGoBack,
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

      {pathSteps && pathSteps.length > 0 ? (
        <details className={styles.pathRecap}>
          <summary>Review or change your path</summary>
          <ol className={styles.pathList}>
            {pathSteps.map((step) => (
              <li key={step.index}>
                {onGoBack ? (
                  <button
                    type="button"
                    className={styles.pathStepButton}
                    onClick={() => onGoBack(step.index)}
                  >
                    {step.label}
                  </button>
                ) : (
                  step.label
                )}
              </li>
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

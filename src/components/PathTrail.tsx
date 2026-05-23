import { useState } from "react";
import type { FlowDefinition, PathStep } from "../data/types";
import styles from "./PathTrail.module.css";

type PathTrailProps = {
  flow: FlowDefinition;
  path: PathStep[];
  onGoBack: (index: number) => void;
  compact?: boolean;
};

export function PathTrail({
  flow,
  path,
  onGoBack,
  compact = false,
}: PathTrailProps) {
  const [open, setOpen] = useState(false);

  if (path.length === 0) return null;

  const steps = path
    .map((step, index) => {
      const node = flow.nodes[step.nodeId];
      if (!node) return null;

      let label = "";
      if (node.type === "start") {
        label = node.title;
      } else if (node.type === "question") {
        label = step.choiceLabel
          ? `${node.label}: ${step.choiceLabel}`
          : node.label;
      } else {
        label = node.title;
      }

      return { index, label };
    })
    .filter(Boolean) as { index: number; label: string }[];

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${compact ? styles.compactToggle : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {compact ? "Go back a step" : `Your path (${steps.length})`}
      </button>

      <div
        className={`${styles.drawer} ${open ? styles.open : ""} ${compact ? styles.compactDrawer : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.drawerInner}>
          <p className={styles.drawerTitle}>
            {compact ? "Change your last answer" : "Tap a step to go back"}
          </p>
          <ol className={styles.trail}>
            {steps.map((step) => (
              <li key={step.index}>
                <button
                  type="button"
                  className={styles.trailButton}
                  onClick={() => {
                    onGoBack(step.index);
                    setOpen(false);
                  }}
                >
                  {step.label}
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

import type { Choice, ChoiceTone } from "../data/types";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./ChoiceButtons.module.css";

type ChoiceButtonsProps = {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  sticky?: boolean;
  animate?: boolean;
};

const toneClass: Record<ChoiceTone, string> = {
  yes: styles.yes,
  no: styles.no,
  neutral: styles.neutral,
};

const staggerClass = [styles.stagger1, styles.stagger2, styles.stagger3, styles.stagger4];

export function ChoiceButtons({
  choices,
  onChoose,
  sticky = true,
  animate = true,
}: ChoiceButtonsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`${styles.wrapper} ${sticky ? styles.sticky : ""}`}
      role="group"
      aria-label="Answer choices"
    >
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          type="button"
          className={[
            styles.button,
            toneClass[choice.tone],
            animate && !reducedMotion ? styles.enter : "",
            animate && !reducedMotion ? staggerClass[index] ?? "" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onChoose(choice)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}

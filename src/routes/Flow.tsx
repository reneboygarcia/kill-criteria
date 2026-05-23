import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChoiceButtons } from "../components/ChoiceButtons";
import { FlowShell } from "../components/FlowShell";
import { SiteFooter } from "../components/SiteFooter";
import { OutcomeCard } from "../components/OutcomeCard";
import { PathTrail } from "../components/PathTrail";
import { QuestionCard } from "../components/QuestionCard";
import { StepTransition } from "../components/StepTransition";
import { getMaxDepth } from "../data/flows";
import { isValidFlowId } from "../data/flowMeta";
import type { FlowId } from "../data/types";
import { buildResultSummary, useFlowState } from "../hooks/useFlowState";
import styles from "./Flow.module.css";

function isFlowId(id: string): id is FlowId {
  return isValidFlowId(id);
}

export function Flow() {
  const { flowId: rawFlowId } = useParams<{ flowId: string }>();

  if (!rawFlowId || !isFlowId(rawFlowId)) {
    return <Navigate to="/" replace />;
  }

  return <FlowRunner flowId={rawFlowId} />;
}

function FlowRunner({ flowId }: { flowId: FlowId }) {
  const mainRef = useRef<HTMLElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const {
    flow,
    currentNode,
    path,
    hydrated,
    choose,
    advanceFromStart,
    goBack,
    restart,
  } = useFlowState(flowId);

  const maxSteps = useMemo(() => (flow ? getMaxDepth(flow) : 1), [flow]);
  const step = path.length + 1;
  const nodeId =
    currentNode && "id" in currentNode ? currentNode.id : undefined;

  const isQuestion = currentNode?.type === "question";
  const isOutcome = currentNode?.type === "outcome";

  const pathSteps = useMemo(() => {
    if (!flow) return [];
    return path
      .map((stepItem, index) => {
        const node = flow.nodes[stepItem.nodeId];
        if (!node) return null;

        let label = "";
        if (node.type === "start") {
          label = node.title;
        } else if (node.type === "question") {
          label = stepItem.choiceLabel
            ? `${node.label}: ${stepItem.choiceLabel}`
            : node.label;
        } else {
          label = node.title;
        }

        return { index, label };
      })
      .filter((step): step is { index: number; label: string } => step !== null);
  }, [flow, path]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [nodeId]);

  if (!hydrated || !flow || !currentNode) {
    return (
      <div className={styles.loading}>
        <p>Loading…</p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (currentNode.type !== "outcome") return;
    const text = buildResultSummary(flow, path, currentNode);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <FlowShell
      tag={flow.tag}
      title={flow.title}
      subtitle={flow.subtitle}
      accent={flow.accent}
      step={Math.min(step, maxSteps)}
      maxSteps={maxSteps}
      focusMode={isQuestion}
    >
      {!isOutcome ? (
        <Link to="/" className={styles.backLink}>
          ← All decisions
        </Link>
      ) : null}

      <section
        ref={mainRef}
        tabIndex={-1}
        className={`${styles.step} ${isQuestion ? styles.questionPage : ""} ${isOutcome ? styles.outcomePage : ""}`}
      >
        {currentNode.type === "start" && (
          <StepTransition stepKey={nodeId ?? "start"}>
            <article className={styles.startCard}>
              <h2 className={styles.startTitle}>{currentNode.title}</h2>
              <p className={styles.startSubtitle}>{currentNode.subtitle}</p>
            </article>
            <ChoiceButtons
              sticky={false}
              choices={[
                {
                  id: "begin",
                  label: "Begin",
                  tone: "neutral",
                  next: currentNode.next,
                },
              ]}
              onChoose={() => advanceFromStart()}
            />
          </StepTransition>
        )}

        {currentNode.type === "question" && (
          <StepTransition stepKey={nodeId ?? "question"}>
            <QuestionCard
              label={currentNode.label}
              title={currentNode.title}
              subtitle={currentNode.subtitle}
              reference={currentNode.reference}
            />
            <ChoiceButtons
              choices={currentNode.choices}
              onChoose={(choice) =>
                choose(choice.id, choice.label, choice.next)
              }
            />
          </StepTransition>
        )}

        {currentNode.type === "outcome" && (
          <StepTransition stepKey={nodeId ?? "outcome"}>
            <OutcomeCard
              node={currentNode}
              pathSteps={pathSteps}
              onGoBack={goBack}
              onCopy={handleCopy}
              onRestart={restart}
              copyStatus={copyStatus}
            />
          </StepTransition>
        )}
      </section>

      {isQuestion && path.length > 0 ? (
        <PathTrail flow={flow} path={path} onGoBack={goBack} compact />
      ) : null}

      {isOutcome ? (
        <Link to="/" className={styles.backLink}>
          ← All decisions
        </Link>
      ) : null}

      <SiteFooter compact />
    </FlowShell>
  );
}

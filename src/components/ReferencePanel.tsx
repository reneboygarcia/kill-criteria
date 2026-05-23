import type { ReferenceBlock } from "../data/types";
import styles from "./ReferencePanel.module.css";

type ReferencePanelProps = {
  reference: ReferenceBlock;
  defaultOpen?: boolean;
};

export function ReferencePanel({
  reference,
  defaultOpen = false,
}: ReferencePanelProps) {
  return (
    <details className={styles.panel} open={defaultOpen || undefined}>
      <summary
        className={
          reference.type === "warning"
            ? `${styles.summary} ${styles.summaryPlain}`
            : styles.summary
        }
      >
        {reference.type === "warning" ? reference.title : null}
      </summary>
      <div className={styles.content}>
        {reference.type === "salary-table" && (
          <>
            <p className={styles.refTitle}>{reference.title}</p>
            <table className={styles.table}>
              <tbody>
                {reference.rows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {reference.type === "niche-grid" && (
          <>
            <p className={styles.refTitle}>{reference.title}</p>
            <div className={styles.nicheGrid}>
              {reference.items.map((item) => (
                <div key={item.title} className={styles.nicheCard}>
                  <p className={styles.nicheTitle}>{item.title}</p>
                  <p className={styles.nicheDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {reference.type === "checklist" && (
          <>
            <p className={styles.refTitle}>{reference.title}</p>
            <div className={styles.checklistCols}>
              {reference.columns.map((col) => (
                <div key={col.title} className={styles.checklistCard}>
                  <p className={styles.checklistTitle}>{col.title}</p>
                  <ul>
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {reference.type === "pivot-grid" && (
          <>
            <p className={styles.refTitle}>{reference.title}</p>
            <div className={styles.pivotGrid}>
              {reference.items.map((item) => (
                <div key={item.title} className={styles.pivotCard}>
                  <p className={styles.pivotTitle}>{item.title}</p>
                  <p className={styles.pivotDesc}>{item.description}</p>
                  <span className={styles.pivotSkill}>{item.skill}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {reference.type === "warning" && (
          <div className={styles.warningBox}>
            <strong>{reference.title}</strong>
            <p>{reference.body}</p>
          </div>
        )}
      </div>
    </details>
  );
}

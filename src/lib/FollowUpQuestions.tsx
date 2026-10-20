import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { AnimatedSize } from "./AnimatedSize";
export function FollowUpQuestions({
  questions,
  onSelect,
  sourceCount = 0,
  onOpenSources,
  title = "你可能还想问",
}: {
  questions: string[];
  onSelect: (question: string) => void;
  sourceCount?: number;
  onOpenSources?: () => void;
  title?: string;
}) {
  return (
    <AnimatedSize>
      {(questions.length > 0 || sourceCount > 0) && (
        <section className="fp-followup-questions">
          <header>
            <strong>{questions.length ? title : "参考资料"}</strong>
            {sourceCount > 0 && onOpenSources && (
              <button
                type="button"
                className="fp-button fp-ghost"
                onClick={onOpenSources}
              >
                来源 · {sourceCount}
              </button>
            )}
          </header>
          {questions.map((question, index) => (
            <button
              key={index}
              type="button"
              className="fp-followup-question"
              onClick={() => onSelect(question)}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  a: ({ children }) => <span>{children}</span>,
                  img: ({ alt }) => <span>{alt}</span>,
                }}
              >
                {question}
              </ReactMarkdown>
            </button>
          ))}
        </section>
      )}
    </AnimatedSize>
  );
}

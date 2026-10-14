import type { CSSProperties } from "react";

interface ProgressBarProps {
  percentage: number;
  animated?: boolean;
}

const ProgressBar = ({ percentage, animated = false }: ProgressBarProps) => {
  const progressStyle: CSSProperties & {
    "--progress-width"?: string;
  } = animated
    ? { "--progress-width": `${percentage}%` }
    : { width: `${percentage}%` };

  return (
    <div className="h-2 w-full min-w-25">
      <div className="h-full w-full rounded-2xl bg-gray-200">
        <div
          className={`h-full rounded-2xl bg-mint-gradient-500 ${
            animated ? "animate-progress" : ""
          }`}
          style={progressStyle}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
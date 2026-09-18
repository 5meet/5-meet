interface ProgressBarProps {
  percentage: number;
  animated?: boolean;
}

const ProgressBar = ({ percentage, animated = false }: ProgressBarProps) => {
  return (
    <div className="h-2 w-full min-w-25">
      <div className="h-full w-full rounded-2xl bg-gray-200">
        <div
          className={`h-full rounded-2xl bg-mint-gradient-500 ${
            animated ? "animate-progress" : ""
          }`}
          style={
            animated
              ? { "--progress-width": `${percentage}%` }
              : { width: `${percentage}%` }
          }
        />
      </div>
    </div>
  );
};

export default ProgressBar;

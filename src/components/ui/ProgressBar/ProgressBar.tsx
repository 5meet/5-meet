interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="h-2 w-full min-w-25">
      <div className="h-full w-full rounded-2xl bg-gray-200">
        <div
          className="h-full rounded-2xl bg-mint-gradient-500 animate-progress"
          style={{ "--progress-width": `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

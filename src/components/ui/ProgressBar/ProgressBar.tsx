interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="h-2 w-full min-w-25">
      <div className="h-full w-full rounded-[16px] border border-none bg-gray-200">
        <div
          className="h-full rounded-[16px] border border-none bg-mint-gradient-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

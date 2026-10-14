import Image from "next/image";

interface OpenConfirmedTagProps {
  isConfirmed: boolean;
}

const OpenConfirmedTag = ({ isConfirmed }: OpenConfirmedTagProps) => {
  if (!isConfirmed) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Image src="/ic_check.svg" alt="" width={16} height={16} />
      <span className="inline-flex items-center text-sm font-semibold text-primary-600">
        개설 확정
      </span>
    </div>
  );
};

export default OpenConfirmedTag;

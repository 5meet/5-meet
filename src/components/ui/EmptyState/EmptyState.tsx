import Image from "next/image";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <section className="flex min-h-[315px] items-center justify-center rounded-[23px]">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-4 h-[66px] w-[100px]">
          <Image
            src="/review_empty.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <p className="text-[14px] font-medium text-[#a7aaad]">
          {message}
        </p>
      </div>
    </section>
  );
}
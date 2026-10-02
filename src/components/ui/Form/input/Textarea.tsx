import React, { forwardRef } from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errMsg?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { errMsg = "", placeholder = "모임을 설명해주세요", required, ...props },
    ref,
  ) => {
    const boxSize = "h-12 w-full px-5 py-3.5";
    const borderType = {
      default: "border-gray-300",
      error: "border-error-100",
    };
    const text = `text-base font-normal text-gray-800 placeholder:text-gray-500`;
    const scrollbar = "overflow-y-auto resize-none textAreaScroll";
    const inputStyle = `${text} ${scrollbar}`;

    return (
      <div className="flex flex-col gap-1 min-w-0 w-112">
        <div
          className={`flex h-25 items-center justify-start rounded-2xl bg-[#F9FAFB] outline-none border ${boxSize} ${borderType[errMsg ? "error" : "default"]}`}
        >
          <textarea
            ref={ref}
            rows={4}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!errMsg}
            className={`flex h-full w-full outline-none transition-colors duration-200 ${inputStyle}`}
            {...props}
          />
        </div>
        {errMsg && (
          <div className="h-5.5 px-2">
            <span className="text-sm font-medium text-error-100">{errMsg}</span>
          </div>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
export default TextArea;

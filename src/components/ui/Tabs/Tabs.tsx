"use client";

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <nav aria-label="탭 메뉴" className="w-full">
      <ul
        className="
          relative flex h-10
          after:absolute after:inset-x-0 after:bottom-0
          after:h-0.5 after:bg-gray-200
          sm:h-[62px]
        "
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <li key={tab.value} className="h-full flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.value)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative z-10
                  flex h-full w-full items-center justify-center
                  whitespace-nowrap
                  text-sm font-semibold leading-5 tracking-[-0.28px]
                  sm:text-xl sm:leading-[30px] sm:tracking-[-0.4px]
                  ${
                    isActive
                      ? "text-primary-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary-500"
                      : "text-gray-600 hover:text-gray-700"
                  }
                `}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

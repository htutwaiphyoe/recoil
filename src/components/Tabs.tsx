import { useState } from "react";

const Tabs = ({ tabs }: { tabs: Array<Tab> }) => {
  const [activatedTab, setActiveTab] = useState<Tab>(tabs[0]);

  //@ts-ignore
  const RenderPanel = activatedTab.Render;
  return (
    <>
      <div className="tabs tabs-boxed mb-2 flex-nowrap">
        {tabs.map((a) => {
          return (
            <a
              key={a.key}
              onClick={() => setActiveTab(a)}
              className={`duration-70 tab h-[60px] w-full items-center gap-2 font-bold transition-all xs:h-[40px] ${
                a.key === activatedTab.key &&
                "tab-active scale-105 font-bold text-primary"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-x-2 xs:flex-row">
                <div>{a.icon}</div>
                <p className="text-xs xs:text-base ">{a.name}</p>
              </div>
            </a>
          );
        })}
      </div>
      <RenderPanel />
    </>
  );
};

export default Tabs;

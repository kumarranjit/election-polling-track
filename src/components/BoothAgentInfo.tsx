import type { BoothInfo } from "../models/models";

export interface BoothAgentInfoProps {
  info: BoothInfo;
}

const infoItemsConfig = [
  { label: "BoothAgent ID", key: "bootAgentId" as const, theme: "emerald" as const },
  { label: "BoothAgent Name", key: "bootAgentName" as const, theme: "amber" as const },
  { label: "State", key: "state" as const, theme: "violet" as const },
  { label: "District", key: "district" as const, theme: "rose" as const },
  { label: "AC", key: "ac" as const, theme: "sky" as const },
  { label: "Booth Numbers", key: "boothNumbers" as const, theme: "indigo" as const },
] as const;

const themeClasses = {
  emerald: "border-l-emerald-500 bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  amber: "border-l-amber-500 bg-amber-50/90 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  violet: "border-l-violet-500 bg-violet-50/90 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200",
  rose: "border-l-rose-500 bg-rose-50/90 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
  sky: "border-l-sky-500 bg-sky-50/90 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
  indigo: "border-l-indigo-500 bg-indigo-50/90 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200",
} as const;

const labelThemeClasses = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  violet: "text-violet-600 dark:text-violet-400",
  rose: "text-rose-600 dark:text-rose-400",
  sky: "text-sky-600 dark:text-sky-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
} as const;

const BoothAgentInfo = ({ info }: BoothAgentInfoProps) => {
  return (
    <div className="group mb-8 relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-violet-500 to-amber-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.18)] hover:scale-[1.005]">
      <div className="relative rounded-[14px] bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <div className="px-5 py-4 sm:px-7 sm:py-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Booth Agent
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {infoItemsConfig.map(({ label, key, theme }) => (
              <div
                key={key}
                className={`flex flex-col rounded-xl border-l-4 px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${themeClasses[theme]}`}
              >
                <span className={`mb-0.5 text-[10px] font-bold uppercase tracking-wider ${labelThemeClasses[theme]}`}>
                  {label}
                </span>
                <span className="truncate text-sm font-bold tracking-tight">
                {Array.isArray(info[key]) ? info[key].join(", ") : info[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothAgentInfo;

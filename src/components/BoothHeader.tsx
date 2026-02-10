import type { BoothInfo } from "../models/models";

export interface BoothHeaderProps {
  info: BoothInfo;
  /** Optional party label shown like: Candidate (PARTY) */
  partyName?: string;
  /** Optional override label for the constituency field (default: "CONS") */
  constituencyLabel?: string;
  /** Optional short label shown in the top-right pill (default: "CONS") */
  topRightPillLabel?: string;
  /** Optional label shown inside the diamond flag (default: "FLAG") */
  flagLabel?: string;
}

function InfoPill({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: string;
  accentClassName: string;
}) {
  return (
    <div
      className={[
        "flex flex-col rounded-xl border bg-white/85 px-3 py-2 shadow-sm backdrop-blur-sm",
        "ring-1 ring-slate-200/80",
        "dark:bg-slate-900/60 dark:ring-slate-700/70",
      ].join(" ")}
    >
      <span
        className={[
          "text-[10px] font-extrabold uppercase tracking-[0.22em]",
          accentClassName,
        ].join(" ")}
      >
        {label}
      </span>
      <span className="mt-0.5 truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

const BoothHeader = ({
  info,
  partyName,
  constituencyLabel = "CONS",
  topRightPillLabel = "CONS",
  flagLabel = "FLAG",
}: BoothHeaderProps) => {
  const candidateLine = partyName?.trim()
    ? `${info.candidateName} (${partyName.trim()})`
    : info.candidateName;

  return (
    <header className="w-full">
      <div className="relative overflow-hidden rounded-2xl p-[2px] shadow-[0_10px_30px_rgba(15,23,42,0.14)] bg-gradient-to-br from-emerald-400 via-sky-500 to-violet-500">
        <div className="relative rounded-[14px] bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {candidateLine}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {/* Diamond "FLAG" */}
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rotate-45 rounded-md bg-gradient-to-br from-slate-200 to-slate-50 ring-1 ring-slate-300/70 shadow-sm dark:from-slate-700 dark:to-slate-800 dark:ring-slate-600/70" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-[10px] font-black tracking-widest text-slate-700 dark:text-slate-200">
                    {flagLabel}
                  </span>
                </div>
              </div>

              {/* Small pill (CONS) */}
              <div className="rounded-lg bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50">
                {topRightPillLabel}
              </div>
            </div>
          </div>

          {/* Middle info row */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3 sm:gap-3">
            <InfoPill label="STATE" value={info.state} accentClassName="text-emerald-700 dark:text-emerald-300" />
            <InfoPill
              label="DISTRICT"
              value={info.district}
              accentClassName="text-sky-700 dark:text-sky-300"
            />
            <InfoPill
              label={constituencyLabel}
              value={info.ac}
              accentClassName="text-violet-700 dark:text-violet-300"
            />
          </div>

          {/* Bottom name strip */}
          <div className="rounded-b-[14px] border-t border-slate-200/70 bg-slate-100/80 px-4 py-2 dark:border-slate-700/70 dark:bg-slate-800/40">
            <p className="truncate text-center text-xs font-black uppercase tracking-[0.28em] text-slate-800 dark:text-slate-100">
              {info.bootAgentName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BoothHeader;

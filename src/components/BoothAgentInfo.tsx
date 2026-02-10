import type { BoothInfo } from "../models/models";
import { getPartyLogoSrc } from "../lib/partyLogos";

export interface BoothAgentInfoProps {
  info: BoothInfo;
  /** Optional party label shown like: Candidate (PARTY) in the header chip */
  partyName?: string;
}

const infoItemsConfig = [
  { label: "State", key: "state" as const, theme: "violet" as const },
  { label: "District", key: "district" as const, theme: "rose" as const },
  { label: "Constituency ", key: "ac" as const, theme: "sky" as const },
] as const;

const labelThemeClasses = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  violet: "text-violet-600 dark:text-violet-400",
  rose: "text-rose-600 dark:text-rose-400",
  sky: "text-sky-600 dark:text-sky-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
} as const;

const BoothAgentInfo = ({ info, partyName }: BoothAgentInfoProps) => {
  const candidateHeading = partyName?.trim()
    ? `${info.candidateName} (${partyName.trim()})`
    : info.candidateName;
  const partyLogoSrc = getPartyLogoSrc(partyName);

  return (
    <section className="mb-6 w-full">
      {/* Header (no card) */}
      <div className="flex items-center gap-3 px-1 py-1 sm:px-0">
        <span className="h-9 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-violet-500" />
        <p className="min-w-0 flex-1 truncate text-xs font-extrabold uppercase tracking-[0.18em] text-slate-800 dark:text-slate-100">
          {candidateHeading}
        </p>
        {partyLogoSrc && (
          <img
            src={partyLogoSrc}
            alt={partyName ? `${partyName} logo` : "Party logo"}
            className="shrink-0 object-contain opacity-90"
            style={{ width: "15%", height: "80%" }}
          />
        )}
      </div>

      {/* Details (lightweight strip, no border/background) */}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 px-1 sm:grid-cols-3 sm:px-0">
        {infoItemsConfig.map(({ label, key, theme }) => (
          <div key={key} className="min-w-0">
            <dt className={`text-[10px] font-bold uppercase tracking-wider ${labelThemeClasses[theme]}`}>
              {label}
            </dt>
            <dd className="mt-1 truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {Array.isArray(info[key]) ? info[key].join(", ") : info[key]}
            </dd>
          </div>
        ))}
      </dl>

      {/* Agent name + mobile single line, centered (mobile only) */}
      <div className="mt-3 pt-2 border-t border-dashed border-slate-200 sm:hidden">
        <p className="text-center text-sm font-semibold tracking-tight text-slate-800">
          {info.bootAgentName}
          {info.agentMobile && (
            <>
              <span className="mx-2 text-slate-300">|</span>
              <a
                href={`tel:${info.agentMobile}`}
                className="text-violet-700 hover:text-violet-800 tabular-nums"
              >
                {info.agentMobile}
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default BoothAgentInfo;

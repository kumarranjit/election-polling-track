import React, { useMemo, useState } from 'react';
import VoteCounter from './VoteCounter';
import type { CountTableProps } from '../models/models';

const CountPollTable: React.FC<CountTableProps> = ({ data, totalVotes = 0 }) => {
  const initialRowState = useMemo(() => {
    return data.reduce<Record<string, { noOfVotesPolled: number; percentage: number | string }>>(
      (acc, item) => {
        acc[item.id] = {
          noOfVotesPolled: item.noOfVotesPolled,
          percentage: item.percentage,
        };
        return acc;
      },
      {}
    );
  }, [data]);

  const [rows, setRows] = useState(initialRowState);

  const computePercentage = (noOfVotesPolled: number, totalVotes: number) => {
    if (!totalVotes) return 0;
    const pct = (noOfVotesPolled / totalVotes) * 100;
    return Math.max(0, Math.min(100, Number(pct.toFixed(2))));
  };

  return (
    <div className="relative overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200 shadow-sm ring-1 ring-gray-900/5">
      <table className="min-w-[320px] w-full text-sm text-gray-700">
        <thead>
          <tr className="border-b border-gray-300">
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 bg-emerald-100/80 sm:text-sm">
              Time slot
            </th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 bg-violet-100/80 sm:text-sm">
              Votes polled
            </th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 bg-blue-100/80 sm:text-sm">
              Action (OR) %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const row = rows[item.id] ?? {
              noOfVotesPolled: item.noOfVotesPolled,
              percentage: item.percentage,
            };
            const percentageText = `${String(row.percentage).replace(/%$/, '')}%`;

            return (
              <tr key={item.id} className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <th scope="row" className="px-3 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900 whitespace-nowrap">
                    {item.timeSlot}
                  </span>
                  {/* <span className="inline-flex w-fit self-center items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                    {percentageText}
                  </span> */}
                </div>
              </th>
              <td className="px-3 py-3 sm:px-6 sm:py-4">
                <VoteCounter
                  min={0}
                  max={totalVotes}
                  value={row.noOfVotesPolled}
                  disabled={item.isDisabled}
                  onChange={(v) =>
                    setRows((prev) => ({
                      ...prev,
                      [item.id]: { ...row, noOfVotesPolled: v },
                    }))
                  }
                />
              </td>
              <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                <div className="flex justify-center">
                  {item.action === "add" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextPct = computePercentage(row.noOfVotesPolled, totalVotes);
                        setRows((prev) => ({
                          ...prev,
                          [item.id]: { ...row, percentage: nextPct },
                        }));
                      }}
                      className="inline-flex min-h-8 min-w-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium leading-[0.75] text-white shadow-sm transition-colors active:scale-[0.98] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
                      aria-label="Add vote count"
                    >
                      <svg
                        className="h-4 w-4 shrink-0"
                        aria-hidden
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Add</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                      {percentageText}
                    </span>
                  )}
                </div>
              </td>
            
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CountPollTable;
import React, { useMemo, useState } from 'react';
import VoteCounter from './VoteCounter';
import type { CountTableProps } from '../models/models';

const CountPollTable: React.FC<CountTableProps> = ({ data, totalVotes = 0, boothName, onAddClick }) => {
  const initialRowState = useMemo(() => {
    return data.reduce<Record<string, { noOfVotesPolled: number; percentage: number | string }>>(
      (acc, item) => {
        acc[item.timeSlotId] = {
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
    <>
    <div className="-mx-1 sm:mx-0 mb-1 border border-gray-200 bg-white px-2 py-1 shadow-sm ring-1 ring-gray-900/5">
      <div className="grid grid-cols-5 items-center gap-2">
        <div className="col-span-1">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900">{totalVotes}</div>
        </div>

        <div className="col-span-4 min-w-0 text-right">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Booth name
          </div>
          <div
            className="min-w-0 truncate text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer"
            title={boothName ?? ""}
            onClick={() => {
              if (boothName) {
                window.alert(boothName);
              }
            }}
          >
            {boothName || "-"}
          </div>
        </div>
      </div>
    </div>
    <div className="relative -mx-2 sm:mx-0 rounded-lg border border-gray-200 shadow-sm ring-1 ring-gray-900/5 overflow-x-hidden">
      <table className="w-full text-xs sm:text-sm text-gray-700 table-fixed">
        <thead>
          <tr className="border-b border-gray-300">
            <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-700 bg-emerald-100/80">
              Time slot
            </th>
            <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-700 bg-pink-100/80">
              TS votes polled
            </th>
            <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-700 bg-violet-100/80">
              Votes polled
            </th>
            <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-700 bg-blue-100/80">
              Action | %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const row = rows[item.timeSlotId] ?? {
              noOfVotesPolled: item.noOfVotesPolled,
              percentage: item.percentage,
            };
            
            const isRowDisabled = Boolean(item.isDisabled || item.isPollEnded);

            return (
              <tr
                key={item.timeSlotId}
                className={[
                  "bg-gray-50/50 transition-colors",
                  isRowDisabled ? "opacity-60" : "hover:bg-gray-50",
                ].join(" ")}
              >
              <th scope="row" className="px-2 py-2 sm:px-4 sm:py-3 align-top">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900 whitespace-nowrap">
                    {item.timeSlotLabel}
                  </span>
                  {/* <span className="inline-flex w-fit self-center items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                    {item.tsPollVotes}
                  </span> */}
                </div>
              </th>
              <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                {Number(item.tsPollVotes ?? 0) > 0 ? (
                  <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-green-800 px-2 py-0.5 text-sm font-semibold text-white">
                    {item.tsPollVotes}
                  </span>
                ) : null}
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-3">              
                <VoteCounter
                  min={0}
                  max={totalVotes}
                  value={row.noOfVotesPolled}
                  disabled={isRowDisabled}
                  onChange={(v) =>
                    setRows((prev) => ({
                      ...prev,
                      [item.timeSlotId]: { ...row, noOfVotesPolled: v },
                    }))
                  }
                />
                 
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                <div className="flex justify-center">
                
                  {item.action === "add" && !item.isPollEnded ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextPct = computePercentage(row.noOfVotesPolled, totalVotes);
                        setRows((prev) => ({
                          ...prev,
                          [item.timeSlotId]: { ...row, percentage: nextPct },
                        }));

                        if (onAddClick) {
                          onAddClick({
                            timeSlot: item.timeSlotLabel,
                            timeSlotId: item.timeSlotId,
                            votes: row.noOfVotesPolled,
                          });
                        }
                      }}
                      className="inline-flex min-h-8 min-w-8 items-center justify-center gap-1.5 rounded-md bg-green-800 px-3 py-1.5 text-xs font-medium leading-[0.75] text-white shadow-sm transition-colors active:scale-[0.98] hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 touch-manipulation"
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
                      {/* <span>Add</span> */}
                    </button>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-violet-800 px-3 py-1.5 text-sm font-semibold text-white">
                      {item.percentage}%
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
    </>
  );
};

export default CountPollTable;
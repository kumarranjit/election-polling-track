import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPartyLogoSrc, getPartyColorClass } from '../../lib/partyLogos';

const API_URL =
  'http://electionbooth.ap-south-1.elasticbeanstalk.com/api/election/byMobile2';
const ADD_SINGLE_VOTE_URL =
  'http://electionbooth.ap-south-1.elasticbeanstalk.com/api/election/addSingleVote';

type VotePoll = {
  votepollId?: number | null;
  timeSlot?: string;
  totalPollVotes?: number;
  tsPollVotes?: number;
  [key: string]: unknown;
};

type Booth = {
  boothpollId: number;
  votePollList?: VotePoll[];
  boothDetails?: {
    boothId?: number;
    boothName?: string;
    totalVoters?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type MultiBLAData = {
  partyName?: string;
  candiName?: string;
  agentMobile?: string;
  stateId?: string | number;
  districtId?: string | number;
  consId?: string | number;
  electionId?: string | number;
  booths: Booth[];
  [key: string]: unknown;
};

// Full ordered list of possible time slots (same order as Excel)
const ALL_TIME_SLOTS = [
  '7 AM - 8 AM',
  '8 AM - 9 AM',
  '9 AM - 10 AM',
  '10 AM - 11 AM',
  '11 AM - 12 PM',
  '12 PM - 1 PM',
  '1 PM - 2 PM',
  '2 PM - 3 PM',
  '3 PM - 4 PM',
  '4 PM - 5 PM',
  '5 PM - 6 PM',
  '6 PM - 7 PM',
  '7 PM - 8 PM',
];

// Decide which time slots to show:
// - If there is votePollList data, collect all distinct timeSlot values,
//   and show those slots in the Excel order above, PLUS the next slot
//   after the latest one (for new entry), if it exists.
// - If ALL booths have empty votePollList, show only the first slot ("7 AM - 8 AM").
function getVisibleTimeSlots(json: MultiBLAData | null | undefined): string[] {
  if (!json || !Array.isArray(json.booths)) {
    return [ALL_TIME_SLOTS[0]];
  }

  const present = new Set();
  json.booths.forEach((booth) => {
    (booth.votePollList || []).forEach((vp) => {
      if (vp.timeSlot) present.add(vp.timeSlot);
    });
  });

  // No existing slots at all -> first slot only
  if (present.size === 0) {
    return [ALL_TIME_SLOTS[0]];
  }

  const orderedVisible = ALL_TIME_SLOTS.filter((slot) => present.has(slot));
  if (orderedVisible.length === 0) {
    return [ALL_TIME_SLOTS[0]];
  }

  const latestSlot = orderedVisible[orderedVisible.length - 1];
  const latestIndex = ALL_TIME_SLOTS.indexOf(latestSlot);
  if (latestIndex !== -1 && latestIndex + 1 < ALL_TIME_SLOTS.length) {
    return [...orderedVisible, ALL_TIME_SLOTS[latestIndex + 1]];
  }

  return orderedVisible;
}

function MultiBLAEntry() {
  const { user, mobileNumber } = useAuth();
  const mobile = user?.agentMobile || mobileNumber || '';
  const [data, setData] = useState<MultiBLAData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [timeSlots, setTimeSlots] = useState([ALL_TIME_SLOTS[0]]);
  const candidateHeading =
    data && data.partyName
      ? `${data.candiName} (${data.partyName})`
      : data?.candiName;
  const partyLogoSrc = data ? getPartyLogoSrc(data.partyName) : null;

  const fetchData = useCallback(async () => {
    if (!mobile) return;
    setError('');
    setSaveMessage('');
    setLoading(true);
    try {
      const url = `${API_URL}?mobile=${encodeURIComponent(mobile)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GET failed with status ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setTimeSlots(getVisibleTimeSlots(json));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [mobile]);

  useEffect(() => {
    if (mobile) fetchData();
  }, [mobile, fetchData]);

  const handleVoteChange = (
    boothpollId: number,
    timeSlot: string,
    value: string
  ) => {
    if (!data) return;
    const next = { ...data };
    next.booths = data.booths.map((booth) => {
      if (booth.boothpollId !== boothpollId) return booth;
      let found = false;
      const existingList = booth.votePollList || [];
      const updatedList = existingList.map((vp) => {
        if (vp.timeSlot !== timeSlot) return vp;
        const totalPollVotes = value === '' ? 0 : Number(value) || 0;
        found = true;
        return {
          ...vp,
          totalPollVotes,
        };
      });

      if (!found) {
        const totalPollVotes = value === '' ? 0 : Number(value) || 0;
        const template = existingList[0] || {};
        updatedList.push({
          ...template,
          // New client-side entry: mark votepollId as 0 so it
          // stays editable until the server assigns a real id.
          votepollId: 0,
          timeSlot,
          totalPollVotes,
        });
      }

      // Recalculate tsPollVotes for this booth based on running totals
      // across ALL_TIME_SLOTS order.
      let prevTotal = 0;
      const recomputedList = updatedList.map((vp) => ({ ...vp }));
      ALL_TIME_SLOTS.forEach((slot) => {
        const idx = recomputedList.findIndex((vp) => vp.timeSlot === slot);
        if (idx === -1) return;
        const current = recomputedList[idx];
        const total = Number(current.totalPollVotes) || 0;
        const tsPollVotes = Math.max(total - prevTotal, 0);
        recomputedList[idx] = {
          ...current,
          tsPollVotes,
        };
        prevTotal = total;
      });

      return { ...booth, votePollList: recomputedList };
    });
    setData(next);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaveMessage('');
    setError('');

    // Build one JSON: booths array, each booth has votePollList with only NEW entries
    const booths = data.booths.map((booth) => {
      const { boothDetails = {}, votePollList: list = [] } = booth;
      const boothId = boothDetails.boothId;
      const boothpollId = booth.boothpollId;
      const votePollList: VotePoll[] = [];
      list.forEach((vp) => {
        if (vp.votepollId === 0 || (vp.votepollId == null && vp.timeSlot)) {
          const paramId = `${data.stateId}_${data.districtId}_${data.consId}_${data.electionId}_${boothId}`;
          const timeSlotFormatted = (vp.timeSlot || '')
            .replace(/\s+/g, '')
            .replace(/-/g, '_');
          const timeSlotId = `booth_${boothpollId}_${timeSlotFormatted}`;
          votePollList.push({
            paramId,
            paramName: 'paramname',
            timeSlot: vp.timeSlot,
            totalPollVotes: Number(vp.totalPollVotes) || 0,
            tsPollVotes: Number(vp.tsPollVotes) || 0,
            timeSlotId,
            createdUser: data.agentMobile || mobile,
          });
        }
      });
      return {
        boothpollId,
        boothDetails,
        votePollList,
      };
    });

    const hasAnyNew = booths.some((b) => b.votePollList.length > 0);
    if (!hasAnyNew) {
      setSaveMessage('No new votes to submit.');
      setSaving(false);
      return;
    }

    const payload = {
      ...data,
      booths,
    };
    try {
      console.log('POST addSingleVote - JSON:', JSON.stringify(payload, null, 2));
      const res = await fetch(ADD_SINGLE_VOTE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`POST failed with status ${res.status}`);
      }
      setSaveMessage('Votes saved successfully.');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="min-h-[calc(100vh-10rem)] -mx-2 sm:-mx-3 lg:-mx-3 px-2 sm:px-2 lg:px-3 py-4 sm:py-4 lg:pb-8 bg-[#0b3b1f]">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Card container */}
        <div className="bg-[#f4fff1] rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-4 lg:p-4">
            {/* Header: Title + Save button */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-800 text-right sm:text-right sm:ml-auto">
                Booth Wise Polling Entry
              </h2>
              {data && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto"
                >
                  {saving ? 'Saving…' : 'Save / Submit'}
                </button>
              )}
            </div> */}

            {data && (
              <div className="flex items-center gap-3 px-1 py-1 sm:px-0 mb-4">
                <span className="h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-emerald-500 to-violet-500" />
                <div className="flex items-center gap-2 min-w-0">
                  <p
                    className={`truncate text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] ${getPartyColorClass(
                      data.partyName
                    )}`}
                  >
                    {candidateHeading}
                  </p>
                  {partyLogoSrc && (
                    <img
                      src={partyLogoSrc}
                      alt={data.partyName ? `${data.partyName} logo` : 'Party logo'}
                      className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 object-contain opacity-90"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Agent info - responsive grid */}
            {/* {data && (
              <div className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Agent</span>
                    <span className="text-gray-900 font-medium">{data.agentName}</span>
                    <span className="text-gray-600 text-xs">{data.agentMobile}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Election</span>
                    <span className="text-gray-900">{data.electionName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Constituency</span>
                    <span className="text-gray-900">{data.consName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Party</span>
                    <span className="text-gray-900">{data.partyName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Candidate</span>
                    <span className="text-gray-900 font-medium">{data.candiName}</span>
                  </div>
                </div>
              </div>
            )} */}

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm flex items-start gap-3 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {saveMessage && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm flex items-start gap-3 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {saveMessage}
              </div>
            )}

            {/* Table wrapper - horizontal scroll on mobile with sticky first columns */}
            {data && (
              <>
              <div className="overflow-x-auto scrollbar-thin -mx-4 sm:mx-0 border-2 border-gray-500 overflow-hidden">
                <div className="min-w-[600px]">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th
                          rowSpan={3}
                          className="sticky left-0 z-20 border-b border-r border-gray-500 bg-white px-3 py-2.5 text-center text-xs font-semibold text-gray-800 w-16 min-w-[64px] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]"
                        >
                          B-IDs
                        </th>
                        <th
                          rowSpan={3}
                          className="sticky left-16 z-20 border-b border-r border-gray-500 bg-white px-3 py-2.5 text-center text-xs font-semibold text-gray-800 min-w-[120px] sm:min-w-[200px] lg:min-w-[280px] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]"
                        >
                          Booth Names
                        </th>
                        <th
                          colSpan={timeSlots.length * 2}
                          className="border-b border-l-2 border-gray-500 bg-[#c6efce] px-3 py-2.5 text-center text-xs font-semibold text-gray-800"
                        >
                          Time Slot
                        </th>
                        <th
                          rowSpan={3}
                          className="border-b border-l border-gray-500 bg-primary-100 px-3 py-2.5 text-center text-xs font-bold text-gray-800 min-w-[90px]"
                        >
                          poll votes / total
                        </th>
                        <th
                          rowSpan={3}
                          className="border-b border-l border-gray-500 bg-primary-100 px-3 py-2.5 text-center text-xs font-bold text-gray-800 min-w-[70px]"
                        >
                          Booth %
                        </th>
                      </tr>
                      <tr>
                        {timeSlots.map((slot) => (
                          <th
                            key={slot}
                            colSpan={2}
                            className="border-b border-l border-gray-500 bg-[#c6efce] px-2 py-1.5 text-center text-xs font-medium text-gray-700"
                          >
                            {slot}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        {timeSlots.map((slot) => (
                          <React.Fragment key={slot}>
                            <th className="border-b border-l border-r border-gray-500 bg-[#ddebf7] px-2 py-1.5 text-center text-xs font-medium text-gray-600 min-w-[44px]">
                              TS
                            </th>
                            <th className="border-b border-r border-gray-500 bg-[#c6efce] px-2 py-1.5 text-center text-xs font-medium text-gray-600 min-w-[52px]">
                              Total
                            </th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.booths.map((booth, index) => {
                        const { boothDetails, votePollList = [] } = booth;
                        const slotMap = new Map<string, VotePoll>(
                          votePollList
                            .filter(
                              (
                                vp
                              ): vp is VotePoll & { timeSlot: string } =>
                                typeof vp.timeSlot === 'string' &&
                                vp.timeSlot.length > 0
                            )
                            .map((vp) => [vp.timeSlot, vp])
                        );
                        const boothTotal = votePollList.reduce(
                          (sum, vp) => sum + (Number(vp.tsPollVotes) || 0),
                          0
                        );
                        const totalVoters = boothDetails?.totalVoters || 0;
                        const percentage =
                          totalVoters > 0 ? ((boothTotal / totalVoters) * 100).toFixed(2) : '-';

                        return (
                          <tr key={booth.boothpollId} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="sticky left-0 z-10 border-b border-r border-gray-500 bg-white group-hover:bg-gray-50 px-2 py-2 text-center text-xs font-medium text-gray-700 w-16 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                              {boothDetails?.boothId ?? index + 1}
                            </td>
                            <td className="sticky left-16 z-10 border-b border-r border-gray-500 bg-white group-hover:bg-gray-50 px-2 py-2 text-xs text-gray-800 min-w-[120px] sm:min-w-[200px] lg:min-w-[280px] max-w-[200px] sm:max-w-none break-words shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                              {boothDetails?.boothName}
                            </td>
                            {timeSlots.map((slot) => {
                              const vp = slotMap.get(slot);
                              const isExistingFromServer =
                                typeof vp?.votepollId === 'number' &&
                                vp.votepollId !== 0;
                              const showInput = !isExistingFromServer;
                              const tsValue = vp?.tsPollVotes ?? '';
                              const totalValue = vp?.totalPollVotes ?? '';
                              return (
                                <React.Fragment key={slot}>
                                  <td className="border-b border-l border-r border-gray-500 px-2 py-1.5 text-right text-xs bg-[#ddebf7] min-w-[44px]">
                                    {tsValue}
                                  </td>
                                  <td
                                    className={`border-b border-r border-gray-500 px-2 py-1.5 bg-[#e2f0d9] min-w-[52px] ${showInput ? 'text-center' : 'text-right'
                                      }`}
                                  >
                                    {showInput ? (
                                      <input
                                        type="number"
                                        min="0"
                                        max={9999}
                                        value={totalValue}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          if (val === '' || val.length <= 4) {
                                            handleVoteChange(booth.boothpollId, slot, val);
                                          }
                                        }}
                                        className="no-number-spinner w-[60px] px-1.5 py-1 rounded-lg border border-gray-500 text-right text-xs focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 bg-white"
                                      />
                                    ) : (
                                      <span className="text-xs font-medium">{totalValue}</span>
                                    )}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="border-b border-l border-gray-500 px-2 py-2 text-right text-xs font-bold text-gray-800 bg-primary-100/50">
                              {boothTotal} / {totalVoters}
                            </td>
                            <td className="border-b border-l border-gray-500 px-2 py-2 text-right text-xs font-bold text-primary-700 bg-primary-100/50">
                              {percentage === '-' ? '-' : `${percentage}%`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {saving ? 'Saving…' : 'Save / Submit'}
                </button>
              </div>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="animate-spin h-12 w-12 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-600 text-sm">Loading your booth data…</p>
              </div>
            )}

            {!data && !loading && !error && !mobile && (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                  Log in to load your booth data.
                </p>
              </div>
            )}

            {!data && !loading && !error && mobile && (
              <div className="text-center py-12 px-4">
                <p className="text-gray-600 text-sm sm:text-base">No booth data found for your account.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MultiBLAEntry;

/**
 * Booth Data page: shows agent info and per-booth polling data.
 *
 * Data flow:
 * 1. useBoothData() fetches from the API; result is stored as bootAgentInfoRes (no mock data).
 * 2. We handle loading, cancelled, error, and empty states first; then render success UI from bootAgentInfoRes.
 * 3. toBoothInfo(bootAgentInfoRes) maps API shape to BoothInfo for the header; tabs are built from bootAgentInfoRes.booths.
 */

import TabComponent from "../../components/TabComponent";
import BoothAgentInfo from "../../components/BoothAgentInfo";
import CountTable from "../../components/VoteCountPollTable";
import type { BoothAgentInfoRes, BoothPollInfo, Tab, TableData } from "../../models/models";
import Loading from "../../components/Loading";
import { useBoothData } from "../../hooks/useBoothData";
import { toBoothInfo } from "../../lib/mapBoothAgentInfo";
import { request } from "../../api/client";

/** Shared retry block for cancelled and error states */
function RetryBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="container mx-auto py-8 text-center space-y-4">
      <p className={message.includes("cancelled") ? "text-gray-600" : "text-red-600 font-medium"}>
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
}

export const BoothDataPage = () => {
  const {
    data: bootAgentInfoRes,
    isLoading,
    isError,
    error,
    status,
    refetch,
  } = useBoothData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 md:py-8">
        <Loading variant="dots" fullScreen={false} message="Loading booth data" />
      </div>
    );
  }

  if (status === "cancelled") {
    return <RetryBlock message="Request cancelled." onRetry={refetch} />;
  }

  if (isError && error) {
    const message = error.message ?? "Something went wrong while fetching data.";
    return <RetryBlock message={message} onRetry={refetch} />;
  }

  if (!bootAgentInfoRes || !bootAgentInfoRes.booths?.length) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-500">No booth data found.</p>
      </div>
    );
  }

  const buildSavePayload = (
    agentInfo: BoothAgentInfoRes,
    booth: BoothPollInfo,
    timeSlot: string,
    tsPollVotes: number
  ): BoothAgentInfoRes => {
    const { stateId, districtId, consId } = agentInfo;
    const boothId = booth.boothDetails.boothId;
    const paramId = `${stateId}_${districtId}_${consId}_${boothId}`;

    return {
      ...agentInfo,
      booths: [
        {
          boothpollId: booth.boothpollId,
          boothDetails: booth.boothDetails,
          votePollList: [
            {
              votepollId: 0,
              paramId,
              paramName: "",
              timeSlot,
              tsPollVotes,
              createdUser: agentInfo.agentMobile,
            },
          ],
        },
      ],
    };
  };

  const SAVE_VOTE_POLL_PATH = "/addSingleVote";

  // Helper function to generate current time slot based on min/max bounds.
  // - Uses 1 hour as a single slot (e.g. 7 AM - 8 AM).
  // - End time will never be greater than the current hour or the max end hour.
  const getCurrentTimeSlot = (): string => {
    const now = new Date();
    const currentHour = now.getHours(); // 0–23

    // Boundaries for polling time slots (in 24h format)
    const minStartHour = 7;  // 07:00 (7 AM)
    const maxEndHour = 19;   // 19:00 (7 PM) → last slot is 18–19

    // Determine the effective latest possible end hour:
    //  - must be <= currentHour (slot already completed)
    //  - must be <= maxEndHour
    let slotEndHour = Math.min(currentHour, maxEndHour);

    // Ensure we are at least one hour after the minimum start.
    // If current time is before polling starts, clamp to first slot.
    if (slotEndHour <= minStartHour) {
      slotEndHour = minStartHour + 1;
    }

    let slotStartHour = slotEndHour - 1;

    // Extra safety: never start before minStartHour
    if (slotStartHour < minStartHour) {
      slotStartHour = minStartHour;
      slotEndHour = minStartHour + 1;
    }

    const formatTime = (hour: number): string => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour} ${period}`; // e.g. "7 AM"
    };

    return `${formatTime(slotStartHour)} - ${formatTime(slotEndHour)}`; // e.g. "7 AM - 8 AM"
  };

  // Success: all data comes from API response (bootAgentInfoRes)
  const boothInfoForHeader = toBoothInfo(bootAgentInfoRes);

  const tabs: Tab[] = bootAgentInfoRes.booths.map((boothData) => {
    const boothDetails = boothData.boothDetails;
    const totalVotes = boothDetails.totalVoters;
    const tableData: TableData[] = boothData.votePollList.map((votePoll) => {
      const percentage = totalVotes ? (votePoll.tsPollVotes / totalVotes) * 100 : 0;
      return {
        id: String(votePoll.votepollId),
        timeSlot: votePoll.timeSlot,
        noOfVotesPolled: votePoll.tsPollVotes,
        percentage: percentage.toFixed(2),
        isDisabled: true,
        isCurrentTimeSlot: false
      };
    });
    
    // Add new object for current time slot from UI for business logic
    tableData.push({
      id: "",
      timeSlot: getCurrentTimeSlot(),
      noOfVotesPolled: "" as any,
      percentage: "0.00",
      isDisabled: false,
      isCurrentTimeSlot: true,
      action: "add"
    });
    

    return {
      id: String(boothDetails.boothId),
      label: `Booth - ${boothDetails.boothId}`,
      totalVotes,
      content: (
        <div className="p-4">
          {totalVotes ? (
            <CountTable
              data={tableData}
              totalVotes={totalVotes}
              onAddClick={async ({ timeSlot, votes }) => {
                if (!bootAgentInfoRes) return;
                const payload = buildSavePayload(
                  bootAgentInfoRes,
                  boothData as BoothPollInfo,
                  timeSlot,
                  votes
                );

                try {
                  const result = await request<unknown>({
                    method: "POST",
                    path: SAVE_VOTE_POLL_PATH,
                    body: payload,
                  });

                  if (result.ok) {
                    // Happy path: refresh data from server so UI reflects latest poll
                    await refetch();
                  } else {
                    const message =
                      result.error?.message ||
                      "Failed to save vote poll. Please try again.";
                    window.alert(message);
                    console.error("Save vote poll failed:", result);
                  }
                } catch (err) {
                  window.alert("Network error while saving vote poll. Please try again.");
                  console.error("Save vote poll error:", err);
                }
              }}
            />
          ) : (
            <p>No polling results for this booth.</p>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                Booth Summary
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="flex flex-col rounded-xl border-l-4 border-l-red-500 bg-blue-50/90 px-4 py-3 text-blue-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-blue-950/40 dark:text-blue-200">
                <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Booth Number
                </span>
                <span className="text-sm font-bold tracking-tight">{boothDetails.boothId}</span>
              </div>
              <div className="flex flex-col rounded-xl border-l-4 border-l-green-500 bg-purple-50/90 px-4 py-3 text-purple-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-purple-950/40 dark:text-purple-200">
                <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                  Total Votes
                </span>
                <span className="text-sm font-bold tracking-tight">{totalVotes}</span>
              </div>
              <div className="hidden sm:flex flex-col rounded-xl border-l-4 border-l-orange-500 bg-cyan-50/90 px-4 py-3 text-cyan-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyan-950/40 dark:text-cyan-200">
                <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Booth Name
                </span>
                <span className="text-sm font-bold tracking-tight leading-snug">
                  {boothDetails.boothName}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2 sm:hidden">
                <div className="flex flex-col rounded-xl border-l-4 border-l-orange-500 bg-cyan-50/90 px-4 py-3 text-cyan-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyan-950/40 dark:text-cyan-200">
                  <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Booth Name
                  </span>
                  {/* <span className="truncate text-sm font-bold tracking-tight">
                    {boothDetails.boothName}
                  </span> */}
                  <span className="text-sm font-bold tracking-tight leading-snug">
                  {boothDetails.boothName}
                </span>
                </div>
            </div>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="container mx-auto py-2 md:py-8">
      <BoothAgentInfo info={boothInfoForHeader} partyName={bootAgentInfoRes.partyName} />
      <TabComponent tabs={tabs} />
    </div>
  );
};

import TabComponent from "../../components/TabComponent";
import BoothAgentInfo from "../../components/BoothAgentInfo";
import CountTable from "../../components/VoteCountPollTable";
import type { Tab, TableData, BootAgentInfo } from "../../models/models";
import { useBoothData } from "../../hooks/useBoothData";
import Loading from "../../components/Loading";

export const BoothDataPage = () => {
  const { data, loading, error, status, refetch } = useBoothData();

  const bootAgentInfo: BootAgentInfo = {
    bootAgentId: "200",
    bootAgentName: "Sant",
    state: "TN",
    district: "Karur",
    ac: "Karur",
    boothNumbers: ["201","202","203","204"],
    boothDatas: [{ boothNo: 201, totalVotes: 1200, boothName:"Booth 200"},
          { boothNo: 202, totalVotes: 1200, boothName:"Booth 201"},
          { boothNo: 203, totalVotes: 1200, boothName:"Booth 202"},
          { boothNo: 204, totalVotes: 1200, boothName:"Booth 204"}]
  };


  const tableData: TableData[] = [
    { id: "1", timeSlot: "9:00 AM - 10:00 AM", noOfVotesPolled: 0, percentage: 0 },
    { id: "2", timeSlot: "10:00 AM - 11:00 AM", noOfVotesPolled: 0, percentage: 0 },
    { id: "3", timeSlot: "11:00 AM - 12:00 PM", noOfVotesPolled: 0, percentage: 0 },
    { id: "4", timeSlot: "12:00 PM - 1:00 PM", noOfVotesPolled: 0, percentage: 0 },
    { id: "5", timeSlot: "1:00 PM - 2:00 PM", noOfVotesPolled: 0, percentage: 0 },
    { id: "6", timeSlot: "2:00 PM - 3:00 PM", noOfVotesPolled: 0, percentage: 0 },
    { id: "7", timeSlot: "3:00 PM - 4:00 PM", noOfVotesPolled: 0, percentage: 0 },
    { id: "8", timeSlot: "4:00 PM - 5:00 PM", noOfVotesPolled: 0, percentage: 0 },
  ];


  // 🔥 Dynamic tabs creation
  const tabs: Tab[] = bootAgentInfo.boothDatas.map((boothData) => {
    const totalVotes = boothData.totalVotes;
    return {
      id: boothData.boothNo.toString(),
      label: `${boothData.boothNo}-Booth`,
      totalVotes,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Booth Overview</h3>

          {/* Booth specific summary – styled with different color scheme to differentiate from BoothAgentInfo */}
          <div className="group mb-6 relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-blue-400 via-cyan-500 to-purple-500 shadow-[0_8px_24px_rgb(15,23,42,0.18)] transition-all duration-300 hover:shadow-[0_8px_32px_rgb(59,130,246,0.25)]">
            <div className="relative rounded-[14px] bg-gradient-to-br from-slate-50/98 to-blue-50/50 backdrop-blur-sm dark:from-slate-800/98 dark:to-slate-900/95">
              <div className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                    Booth Summary
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="flex flex-col rounded-xl border-l-4 border-l-red-500 bg-blue-50/90 px-4 py-3 text-blue-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-blue-950/40 dark:text-blue-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                      Booth Number
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {boothData.boothNo}
                    </span>
                  </div>

                  <div className="flex flex-col rounded-xl border-l-4 border-l-green-500 bg-purple-50/90 px-4 py-3 text-purple-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-purple-950/40 dark:text-purple-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                      Total Votes
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {totalVotes}
                    </span>
                  </div>

                  <div className="flex flex-col rounded-xl border-l-4 border-l-orange-500 bg-cyan-50/90 px-4 py-3 text-cyan-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyan-950/40 dark:text-cyan-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Booth Name
                    </span>
                    <span className="truncate text-sm font-bold tracking-tight">
                      {boothData.boothName}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
          
          {totalVotes ? (
            <CountTable data={tableData} totalVotes={totalVotes} />
          ) : (
            <p>Polling results for this booth.</p>
          )}
        </div>
      ),
    };
  });

  if (loading) {
    return (
      <Loading
        variant="skeleton"
        fullScreen={false}
        message="Loading booth data"
      />
    );
  }

  if (status === "cancelled") {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">Request cancelled.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    const msg =
      (error as any)?.message ?? "Something went wrong while fetching data.";
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium">{msg}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No booths found.</p>;
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      <BoothAgentInfo info={bootAgentInfo} />
      <TabComponent tabs={tabs} />
    </div>
  );
};

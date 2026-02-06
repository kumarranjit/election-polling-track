import TabComponent from "../../components/TabComponent";
import BoothAgentInfo from "../../components/BoothAgentInfo";
import CountTable from "../../components/VoteCountPollTable";
import type { Tab, TableData, BootAgentInfo } from "../../models/models";

export const BoothDataPage = () => {
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

          {/* Booth specific summary – styled similar to BoothAgentInfo */}
          <div className="group mb-6 relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-violet-500 to-amber-400 shadow-[0_8px_24px_rgb(15,23,42,0.18)]">
            <div className="relative rounded-[14px] bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
              <div className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Booth Summary
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="flex flex-col rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50/90 px-4 py-3 text-emerald-800 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Booth Number
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {boothData.boothNo}
                    </span>
                  </div>

                  <div className="flex flex-col rounded-xl border-l-4 border-l-amber-500 bg-amber-50/90 px-4 py-3 text-amber-800 shadow-sm dark:bg-amber-950/40 dark:text-amber-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Booth Name
                    </span>
                    <span className="truncate text-sm font-bold tracking-tight">
                      {boothData.boothName}
                    </span>
                  </div>

                  <div className="flex flex-col rounded-xl border-l-4 border-l-violet-500 bg-violet-50/90 px-4 py-3 text-violet-800 shadow-sm dark:bg-violet-950/40 dark:text-violet-200">
                    <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      Total Votes
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {totalVotes}
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

  return (
    <div className="container mx-auto py-4 md:py-8">
      <BoothAgentInfo info={bootAgentInfo} />
      <TabComponent tabs={tabs} />
    </div>
  );
};

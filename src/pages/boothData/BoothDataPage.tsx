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
    <div className="container mx-auto py-8">
      <BoothAgentInfo info={bootAgentInfo} />
      <TabComponent tabs={tabs} />
    </div>
  );
};

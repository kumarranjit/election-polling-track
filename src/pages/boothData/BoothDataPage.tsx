import TabComponent from "../../components/TabComponent";
import CountTable from "../../components/VoteCountPollTable";
import type { Tab, TableData, BootAgentInfo } from "../../models/models";

export const BoothDataPage = () => {
  // BootAgent basic info - displayed above tabs
  const bootAgentInfo: BootAgentInfo = {
    bootAgentId: "200",
    baName: "Sant",
    state: "TN",
    district: "Karur",
    ac: "Karur",
    boothNumbers: "200-201-202",
  };
  // Table data array with objects
  const tableData: TableData[] = [
    {
      id: "1",
      timeSlot: "9:00 AM - 10:00 AM",
      totalVotes: 1250,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "2", 
      timeSlot: "10:00 AM - 11:00 AM",
      totalVotes: 1380,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "3",
      timeSlot: "11:00 AM - 12:00 PM", 
      totalVotes: 1150,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "4",
      timeSlot: "12:00 PM - 1:00 PM",
      totalVotes: 1420,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "5",
      timeSlot: "1:00 PM - 2:00 PM",
      totalVotes: 980,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "6",
      timeSlot: "2:00 PM - 3:00 PM",
      totalVotes: 1650,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "7",
      timeSlot: "3:00 PM - 4:00 PM",
      totalVotes: 1320,
      noOfVotesPolled: 0,
      percentage: 0.00
    },
    {
      id: "8",
      timeSlot: "4:00 PM - 5:00 PM",
      totalVotes: 1180,
      noOfVotesPolled: 0,
      percentage: 0.00
    }
  ];
  // Example array of tabs - replace with your actual data
  const tabs: Tab[] = [
    {
      id: "201",
      label: "201-Booth1",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Booth Overview</h3>
           <CountTable data={tableData} />
        </div>
      ),
    },
    {
      id: "202",
      label: "202-Booth2",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Voters Data</h3>
          <CountTable data={tableData} />
        </div>
      ),
    },
    {
      id: "203",
      label: "202-Booth3",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Election Results</h3>
          <p>Polling results for this booth.</p>
        </div>
      ),
    },
    {
      id: "204",
      label: "202-Booth4",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Election Results</h3>
          <p>Polling results for this booth.</p>
        </div>
      ),
    },
  ];

  const infoItems = [
    { label: "BoothAgent ID", value: bootAgentInfo.bootAgentId},
    { label: "BoothAgent Name", value: bootAgentInfo.baName },
    { label: "State", value: bootAgentInfo.state },
    { label: "District", value: bootAgentInfo.district },
    { label: "AC", value: bootAgentInfo.ac },
    { label: "Booth Numbers", value: bootAgentInfo.boothNumbers },
  ] as const;

  return (
    <div className="container mx-auto py-8">
      {/* BootAgent Info Card - above TabComponent */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-900/5 transition-shadow hover:shadow-xl hover:shadow-gray-200/60">
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-stretch gap-4 sm:gap-6">
            {infoItems.map(({ label, value }) => (
              <div
                key={label}
                className={`flex min-w-0 flex-1 basis-28 flex-col rounded-xl px-4 py-3 transition-colors ${
                  label === "BoothAgent Name"
                    ? "bg-blue-50/80 ring-1 ring-blue-100"
                    : "bg-gray-50/60 ring-1 ring-gray-100"
                }`}
              >
                <span className="mb-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {label}
                </span>
                <span
                  className={`truncate font-semibold tracking-tight ${
                    label === "BoothAgent Name" ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabComponent tabs={tabs} />
    </div>
  );
};

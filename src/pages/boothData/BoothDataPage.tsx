import TabComponent from "../../components/TabComponent";
import CountTable from "../../components/VoteCountPollTable";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TableData {
  id: string;
  timeSlot: string;
  totalVotes: number;
  noOfVotesPolled: number;
  percentage: number | string;
  action?: string;
}

export const BoothDataPage = () => {
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

  return (
    <div className="container mx-auto py-8">
      {/* <h1 className="text-2xl font-bold mb-6">Booth Data</h1> */}
      <TabComponent tabs={tabs} />
    </div>
  );
};

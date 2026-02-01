import TabComponent from "../../components/TabComponent";
import CountTable from "../../components/VoteCountPollTable";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export const BoothDataPage = () => {
  // Example array of tabs - replace with your actual data
  const tabs: Tab[] = [
    {
      id: "201",
      label: "201-Booth1",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Booth Overview</h3>
           <CountTable />
        </div>
      ),
    },
    {
      id: "202",
      label: "202-Booth2",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Voters Data</h3>
          <CountTable />
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

import { BoothDataPage } from "../boothData/BoothDataPage";

function Home() {
  return (
    <>
      {/* <section className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to Vote Polling Tracker
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-8">
          Your modern, secure vote polling tracker platform for elections and surveys.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Get Started
        </button>
      </section> */}
      <BoothDataPage />
      {/* Features Section */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Secure Voting</h3>
            <p className="text-gray-600">
              End-to-end encrypted voting system ensuring privacy and security.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Real-time Results</h3>
            <p className="text-gray-600">
              Live updates and analytics for instant insights.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Mobile Friendly</h3>
            <p className="text-gray-600">
              Optimized for all devices with responsive design.
            </p>
          </div>
        </div>
      </section> */}

      {/* Content Block */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center mb-8">
            Our platform makes polling simple and accessible. Follow these steps
            to get started.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Poll</h3>
              <p className="text-gray-600">
                Set up your poll with custom questions and options.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Vote</h3>
              <p className="text-gray-600">
                Distribute the link and let participants vote securely.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}

export default Home;

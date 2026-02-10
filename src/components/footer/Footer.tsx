import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-1 md:mb-0">
            <p className="text-sm">&copy; 2026 ElectionPoll. All rights reserved.</p>
          </div>
          {/* <div className="flex space-x-6">
            <a href="#home" className="text-sm hover:text-gray-300 transition-colors duration-200">Home</a>
            <a href="#about" className="text-sm hover:text-gray-300 transition-colors duration-200">About</a>
            <a href="#contact" className="text-sm hover:text-gray-300 transition-colors duration-200">Contact</a>
            <a href="#privacy" className="text-sm hover:text-gray-300 transition-colors duration-200">Privacy</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
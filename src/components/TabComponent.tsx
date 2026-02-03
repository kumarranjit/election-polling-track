import React, { useState } from 'react';
import type { TabComponentProps } from '../models/models';

const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  defaultActiveTab,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const getTabClasses = (isActive: boolean) => {
    const baseClasses = "relative px-6 py-3 text-sm font-medium";
    switch (variant) {
      case 'pills':
        return `${baseClasses} ${
          isActive
            ? 'bg-blue-600 text-white border-b-2 border-blue-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border-b border-gray-200'
        }`;
      default:
        return `${baseClasses} ${
          isActive
            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-b border-gray-200'
        }`;
    }
  };

  return (
    <div className="w-full  mx-auto">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={getTabClasses(isActive)}
              aria-selected={isActive}
              role="tab"
            >
              <div className="flex items-center space-x-2">
                {tab.icon && (
                  <span className={isActive ? 'text-current' : 'text-gray-400'}>
                    {tab.icon}
                  </span>
                )}
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && variant === 'pills' && (
                  <div className="w-2 h-2 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`absolute inset-0 p-1 ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
            >
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 scrollbar-thumb-rounded">
                {tab.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-friendly indicator */}
      <div className="md:hidden mt-4 flex justify-center">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-3 h-3 rounded-full ${
                activeTab === tab.id
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${tab.label} tab`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
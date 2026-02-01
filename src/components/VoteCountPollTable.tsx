import React from 'react';
import VoteCounter from './VoteCounter';

const CountPollTable: React.FC = () => {
  return (
    <div className="relative overflow-x-auto bg-gray-50 shadow-sm rounded-lg border border-gray-300">
      <table className="w-full text-sm text-left rtl:text-right text-gray-700">
        <thead className="text-sm text-gray-700 bg-gray-100 border-b border-gray-400">
          <tr>
           <th scope="col" className="px-6 py-3 font-medium">
             Time slot
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Vote
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Percentage
            </th> 
            <th scope="col" className="px-6 py-3 font-medium"> 
              Action
            </ th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50 border-b border-gray-300 hover:bg-gray-100">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">
                <VoteCounter initialValue={0} />
            </td>
            <td className="px-6 py-4">Laptop</td>
            <td className="flex items-center px-6 py-4">
              <a href="#" className="font-medium text-blue-600 hover:underline">Submit</a>
              <a href="#" className="font-medium text-red-600 hover:underline ml-3">Remove</a>
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default CountPollTable;
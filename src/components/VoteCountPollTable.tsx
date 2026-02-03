import React from 'react';
import VoteCounter from './VoteCounter';
import type { TableData, CountTableProps } from '../models/models';

const CountPollTable: React.FC<CountTableProps> = ({ data }) => {
  return (
    <div className="relative overflow-x-auto bg-gray-50 shadow-sm rounded-lg border border-gray-300">
      <table className="w-full text-sm text-left rtl:text-right text-gray-700">
        <thead className="text-sm text-gray-700 bg-gray-100 border-b border-gray-400">
          <tr>
           <th scope="col" className="px-6 py-3 font-medium">
             Time slot
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
             Number of votes polled
            </th>
            <th scope="col" className="px-6 py-3 font-medium"> 
              Action
            </ th>
            <th scope="col" className="px-6 py-3 font-medium">
              Percentage
            </th> 
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="bg-gray-50 border-b border-gray-300 hover:bg-gray-100">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.timeSlot}
              </th>
              <td className="px-6 py-4">
                <VoteCounter initialValue={item.noOfVotesPolled} />
              </td>
              <td className="flex items-center px-6 py-4">
                <a href="#" className="font-medium text-blue-600 hover:underline">Submit</a>
              </td>
              <td className="px-6 py-4">
                {item.percentage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountPollTable;
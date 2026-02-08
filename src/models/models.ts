// Common interfaces and types for the Election Polling Track application

import React from 'react';

// Tab Component Interfaces
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  totalVotes?: number; // Booth-specific total votes (shared across time slots)
  icon?: React.ReactNode; // Optional icon for each tab
}

export interface TabComponentProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  variant?: 'default' | 'pills';
}

// Vote Counter Interfaces
export interface VoteCountProps {
  initialValue?: number;
  min?: number;
  max?: number;
}

// Table Data Interfaces for Vote Count Poll Table
export interface TableData {
  id: string;
  timeSlot: string;
  noOfVotesPolled: number;
  percentage: number | string;
  action?: string;
}

export interface CountTableProps {
  data: TableData[];
  totalVotes?: number; // Booth-specific total (not per time slot)
}

// Quantity Counter Interfaces
export interface QuantityCounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
}

// Product Table Interfaces
export interface ProductTableData {
  id: string;
  timeSlot: string;
  productName: string;
  color: string;
  quantity?: number;
  action?: string;
}

// Generic Table Data Interface (for flexible table structures)
export interface GenericTableData {
  id: string;
  [key: string]: any;
}

// Booth Data Interface
export interface BoothData {
  boothNo: number;
  totalVotes: number;
  boothName: string;
}
// BootAgent Info Interface (displayed above booth tabs)
export interface BootAgentInfo {
  bootAgentId: string;
  bootAgentName: string;
  state: string;
  district: string;
  ac: string;
  boothNumbers: string[];
}

// API booth response interfaces (booths list with poll data)
export interface BoothDetails {
  boothId: number;
  boothName: string;
  maleVoters: number;
  femaleVoters: number;
  transgenderVoters: number;
  totalVoters: number;
}

export interface VotePoll {
  votepollId: number;
  paramId: string;
  paramName: string;
  timeSlot: string;
  tsPollVotes: number;
  createdUser: string;
}

export interface BoothPollInfo {
  boothpollId: number;
  boothDetails: BoothDetails;
  votePollList: VotePoll[];
}

export interface BoothAgentInfoRes {
  agentName: string;
  agentMobile: string;
  agentId: number;
  stateName: string;
  stateId: number;
  districtName: string;
  districtId: number;
  consName: string;
  consId: number;
  electionName: string;
  electionId: number;
  partyId: number;
  partyName: string;
  candiName: string;
  candiId: number;
  booths: BoothPollInfo[];
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string;              
  body?: TBody;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiErrorShape {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}
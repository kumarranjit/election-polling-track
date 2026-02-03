// Common interfaces and types for the Election Polling Track application

import React from 'react';

// Tab Component Interfaces
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
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
  totalVotes: number;
  noOfVotesPolled: number;
  percentage: number | string;
  action?: string;
}

export interface CountTableProps {
  data: TableData[];
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

// BootAgent Info Interface (displayed above booth tabs)
export interface BootAgentInfo {
  bootAgentId: string;
  baName: string;
  state: string;
  district: string;
  ac: string;
  boothNumbers: string;
}
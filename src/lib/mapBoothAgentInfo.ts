/**
 * Maps the booth-agent API response (BoothAgentInfoRes) to the shape expected by the BoothAgentInfo header component (BoothInfo).
 *
 * This keeps API response types separate from UI component props, so backend changes only touch this mapper.
 */

import type { BoothAgentInfoRes, BoothInfo } from "../models/models";

const MIN_START_HOUR = 7;
const MAX_END_HOUR = 20;

/** Format a 24h hour (0–23) as "7 AM" or "12 PM". */
export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
}

/** Format a 1-hour slot as "7 AM - 8 AM". */
export function formatTimeSlotLabel(startHour: number, endHour: number): string {
  return `${formatHourLabel(startHour)} - ${formatHourLabel(endHour)}`;
}

export function toBoothInfo(res: BoothAgentInfoRes): BoothInfo {
  return {
    bootAgentId: String(res.agentId),
    bootAgentName: res.agentName,
    agentMobile: res.agentMobile,
    state: "TN", //res.stateName,
    district: res.districtName,
    ac: res.consName,
    candidateName: res.candiName,
    partyName: res.partyName,
    boothNumbers: res.booths.map((b) => String(b.boothDetails.boothId)),
  };
}

export type TimeSlot = {
  startHour: number;
  endHour: number;
  id: string;
  label: string;
  noOfVotesPolled: number;
  percentage: number;
  isDisabled: boolean;
  isCurrentTimeSlot: boolean;
  action?: "add" | "update" | "";
}

const getCurrentTime = (): { startHour: number, endHour: number } => {
  const now = new Date();
  const startHour = now.getHours();
  const endHour = startHour + 1;
  return { startHour, endHour };
}

export const getTimeSlots = (): TimeSlot[] | [] => {
  const timeSlots: TimeSlot[] = [];
  for (let i = MIN_START_HOUR; i <= MAX_END_HOUR; i++) {
    const currentTimeSlot = getCurrentTime();
    if(i <= currentTimeSlot.endHour) {
    const isCurrentTimeSlot = i === currentTimeSlot?.startHour;
    const time_slot = formatTimeSlotLabel(i, i + 1);
    const time_slot_id = time_slot.replace(/\s*-\s*/, '_').replace(/\s+/g, '');
      timeSlots.push({
        startHour: i,
        endHour: i + 1,
        id: time_slot_id,
        label: time_slot,
        isCurrentTimeSlot: isCurrentTimeSlot,
        noOfVotesPolled: 0,
        percentage: 0,
        isDisabled: false,
        action: isCurrentTimeSlot ? 'add': ''
      });
    }
  }
  return timeSlots;
}
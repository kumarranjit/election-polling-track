/**
 * Maps the booth-agent API response (BoothAgentInfoRes) to the shape expected by the BoothAgentInfo header component (BoothInfo).
 *
 * This keeps API response types separate from UI component props, so backend changes only touch this mapper.
 */

import type { BoothAgentInfoRes, BoothInfo } from "../models/models";

export function toBoothInfo(res: BoothAgentInfoRes): BoothInfo {
  return {
    bootAgentName: res.agentName,
    state: res.stateName,
    district: res.districtName,
    ac: res.consName,
    candidateName: res.candiName,
    partyName: res.partyName,
    boothNumbers: res.booths.map((b) => String(b.boothDetails.boothId)),
  };
}

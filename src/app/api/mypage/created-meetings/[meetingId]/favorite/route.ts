// Favorites have identical permissions for joined and hosted meetings.
// Reuse the authenticated handler, including token refresh and error handling.
export { POST, DELETE } from "../../../joined-meetings/[meetingId]/favorite/route";

import { ExternalApiService } from "./externalApiService";
import { AuthService } from "./authService";

export class MeetingsService {

  // Start meeting creation process
  static async startMeetingCreation(meetingData) {
    try {
      const response = await ExternalApiService.post(
        "/meetings/start-creation",
        meetingData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Start meeting creation error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Verify organizer email - can use current email or provide new one
  static async verifyOrganizerEmail(sessionId, useCurrentEmail = true, newEmail = "") {
    try {
      const response = await ExternalApiService.post(
        "/meetings/verify-organizer-email",
        {
          sessionId,
          useCurrentEmail,
          newEmail,
        },
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Verify organizer email error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Confirm organizer email with OTP
  static async confirmOrganizerEmail(sessionId, email, otp) {
    try {
      const response = await ExternalApiService.post(
        "/meetings/confirm-organizer-email",
        {
          sessionId,
          email,
          otp,
        },
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Confirm organizer email error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Verify attendee emails - can provide updates for individual emails
  static async verifyAttendeeEmails(sessionId, attendeeEmailUpdates = []) {
    try {
      const response = await ExternalApiService.post(
        "/meetings/verify-attendee-emails",
        {
          sessionId,
          attendeeEmailUpdates,
        },
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Verify attendee emails error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Confirm attendee email with OTP (public endpoint - no auth required)
  static async confirmAttendeeEmail(sessionId, email, otp) {
    try {
      const response = await ExternalApiService.post(
        "/meetings/confirm-attendee-email",
        {
          sessionId,
          email,
          otp,
        }
        // Note: No auth token for public endpoint
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Confirm attendee email error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Complete meeting creation
  static async completeMeetingCreation(sessionId) {
    try {
      const response = await ExternalApiService.post(
        "/meetings/complete-creation",
        {
          sessionId,
        },
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Complete meeting creation error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getCreationStatus(sessionId) {
    try {
      const response = await ExternalApiService.get(
        `/meetings/creation-status/${sessionId}`,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get creation status error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getAllMeetings(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        meetingType,
        startDate,
        endDate,
        search,
      } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) queryParams.append("status", status);
      if (meetingType) queryParams.append("meetingType", meetingType);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (search) queryParams.append("search", search);

      const endpoint = `/admin/meetings?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get all meetings error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getMeetingAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const endpoint = `/admin/meetings/analytics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get meeting analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Meeting types options
  static getMeetingTypes() {
    return [
      { value: "google-meet", label: "Google Meet" },
      { value: "zoom", label: "Zoom" },
      { value: "teams", label: "Microsoft Teams" },
      { value: "webex", label: "Cisco Webex" },
      { value: "other", label: "Other" },
    ];
  }


  // Meeting status options
  static getMeetingStatuses() {
    return [
      { value: "scheduled", label: "Scheduled" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "pending-verification", label: "Pending Verification" },
    ];
  }


  // Timezone options (common ones)
  static getTimezones() {
    return [
      { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
      { value: "UTC", label: "UTC" },
      { value: "America/New_York", label: "America/New_York (EST/EDT)" },
      { value: "Europe/London", label: "Europe/London (GMT/BST)" },
      { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
      { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)" },
      { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
    ];
  }

}
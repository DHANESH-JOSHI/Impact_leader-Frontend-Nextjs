import { apiClient } from '@/lib/apiClient';
import { MEETINGS } from '@/constants/apiEndpoints';

export class MeetingsService {
  static async startMeetingCreation(meetingData) {
    try {
      const response = await apiClient.post("/meetings/start-creation", meetingData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Start meeting creation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async verifyOrganizerEmail(sessionId, useCurrentEmail = true, newEmail = "") {
    try {
      const response = await apiClient.post("/meetings/verify-organizer-email", {
        sessionId,
        useCurrentEmail,
        newEmail,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Verify organizer email error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async confirmOrganizerEmail(sessionId, email, otp) {
    try {
      const response = await apiClient.post("/meetings/confirm-organizer-email", {
        sessionId,
        email,
        otp,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Confirm organizer email error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async verifyAttendeeEmails(sessionId, attendeeEmailUpdates = []) {
    try {
      const response = await apiClient.post("/meetings/verify-attendee-emails", {
        sessionId,
        attendeeEmailUpdates,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Verify attendee emails error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async confirmAttendeeEmail(sessionId, email, otp) {
    try {
      const response = await apiClient.post("/meetings/confirm-attendee-email", {
        sessionId,
        email,
        otp,
      }, { skipAuth: true });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Confirm attendee email error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async completeMeetingCreation(sessionId) {
    try {
      const response = await apiClient.post("/meetings/complete-creation", {
        sessionId,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Complete meeting creation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getCreationStatus(sessionId) {
    try {
      const response = await apiClient.get(`/meetings/creation-status/${sessionId}`);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Get creation status error:', error);
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

      const queryParams = {
        page,
        limit,
      };

      if (status) queryParams.status = status;
      if (meetingType) queryParams.meetingType = meetingType;
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (search) queryParams.search = search;

      const response = await apiClient.get("/admin/meetings", {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Get all meetings error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getMeetingAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      const response = await apiClient.get("/admin/meetings/analytics", {
        params: { timeframe, groupBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Meetings] Get meeting analytics error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getMeetingTypes() {
    return [
      { value: "google-meet", label: "Google Meet" },
      { value: "zoom", label: "Zoom" },
      { value: "teams", label: "Microsoft Teams" },
      { value: "webex", label: "Cisco Webex" },
      { value: "other", label: "Other" },
    ];
  }

  static getMeetingStatuses() {
    return [
      { value: "scheduled", label: "Scheduled" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "pending-verification", label: "Pending Verification" },
    ];
  }

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

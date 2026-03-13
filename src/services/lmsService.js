'use strict';

const axios = require('axios');

/**
 * LMS (Learning Management System) Service
 * Handles syncing attendance records with the LMS API.
 */
class LmsService {
  constructor() {
    this.apiUrl = process.env.LMS_API_URL || '';
    this.apiKey = process.env.LMS_API_KEY || '';
    this.apiSecret = process.env.LMS_API_SECRET || '';
  }

  /**
   * Build the default Axios request config with auth headers.
   */
  _getRequestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-API-Secret': this.apiSecret,
      },
      timeout: 15000,
    };
  }

  /**
   * Check whether the LMS integration is configured.
   */
  isConfigured() {
    return Boolean(this.apiUrl && this.apiKey);
  }

  /**
   * Fetch the list of courses from the LMS.
   *
   * @returns {Promise<Array>} List of LMS course objects
   */
  async getCourses() {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const response = await axios.get(`${this.apiUrl}/courses`, this._getRequestConfig());
    return response.data.courses || response.data;
  }

  /**
   * Fetch enrolled students for a specific LMS course.
   *
   * @param {string} lmsCourseId - The LMS course ID
   * @returns {Promise<Array>} List of enrolled student objects
   */
  async getCourseEnrollments(lmsCourseId) {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const response = await axios.get(
      `${this.apiUrl}/courses/${lmsCourseId}/enrollments`,
      this._getRequestConfig()
    );
    return response.data.enrollments || response.data;
  }

  /**
   * Create an attendance session in the LMS.
   *
   * @param {string} lmsCourseId - The LMS course ID
   * @param {object} sessionData - Session metadata (topic, date, etc.)
   * @returns {Promise<{lmsSessionId: string}>}
   */
  async createSession(lmsCourseId, sessionData) {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const response = await axios.post(
      `${this.apiUrl}/courses/${lmsCourseId}/sessions`,
      sessionData,
      this._getRequestConfig()
    );

    return { lmsSessionId: response.data.session_id || response.data.id };
  }

  /**
   * Record a single student attendance entry in the LMS.
   *
   * @param {string} lmsSessionId - The LMS session ID
   * @param {string} lmsUserId - The LMS user ID of the student
   * @param {string} status - Attendance status ('present', 'late', 'absent', 'excused')
   * @param {Date} capturedAt - Timestamp of attendance capture
   * @returns {Promise<{lmsAttendanceId: string}>}
   */
  async recordAttendance(lmsSessionId, lmsUserId, status, capturedAt) {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const response = await axios.post(
      `${this.apiUrl}/sessions/${lmsSessionId}/attendance`,
      {
        user_id: lmsUserId,
        status,
        captured_at: capturedAt,
      },
      this._getRequestConfig()
    );

    return { lmsAttendanceId: response.data.attendance_id || response.data.id };
  }

  /**
   * Sync a batch of attendance records to the LMS.
   * Returns summary of successful and failed syncs.
   *
   * @param {string} lmsSessionId - The LMS session ID
   * @param {Array<{lmsUserId: string, status: string, capturedAt: Date}>} records
   * @returns {Promise<{synced: number, failed: number, results: Array}>}
   */
  async syncBatchAttendance(lmsSessionId, records) {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const results = [];
    let synced = 0;
    let failed = 0;

    for (const record of records) {
      try {
        const result = await this.recordAttendance(
          lmsSessionId,
          record.lmsUserId,
          record.status,
          record.capturedAt
        );
        results.push({ ...record, success: true, lmsAttendanceId: result.lmsAttendanceId });
        synced++;
      } catch (error) {
        results.push({ ...record, success: false, error: error.message });
        failed++;
      }
    }

    return { synced, failed, results };
  }

  /**
   * Fetch the attendance report for a specific LMS session.
   *
   * @param {string} lmsSessionId - The LMS session ID
   * @returns {Promise<Array>} List of attendance records
   */
  async getSessionAttendance(lmsSessionId) {
    if (!this.isConfigured()) throw new Error('LMS service is not configured');

    const response = await axios.get(
      `${this.apiUrl}/sessions/${lmsSessionId}/attendance`,
      this._getRequestConfig()
    );

    return response.data.attendance || response.data;
  }
}

module.exports = new LmsService();

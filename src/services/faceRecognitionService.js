'use strict';

const axios = require('axios');
const FormData = require('form-data');

/**
 * Face Recognition Service for CCTV-based attendance.
 * Integrates with an external face recognition API to identify students
 * from CCTV frames and match against enrolled face profiles.
 */
class FaceRecognitionService {
  constructor() {
    this.apiUrl = process.env.FACE_RECOGNITION_API_URL || '';
    this.apiKey = process.env.FACE_RECOGNITION_API_KEY || '';
    this.matchThreshold = parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.85');
  }

  /**
   * Identify a person from an image buffer by calling the face recognition API.
   * Returns the matched external face ID and confidence score.
   *
   * @param {Buffer} imageBuffer - Image data from CCTV frame
   * @param {string} mimeType - MIME type of the image (e.g. 'image/jpeg')
   * @returns {Promise<{externalFaceId: string, confidence: number}|null>}
   */
  async identifyFromImage(imageBuffer, mimeType = 'image/jpeg') {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Face recognition service is not configured');
    }

    const form = new FormData();
    form.append('image', imageBuffer, { contentType: mimeType, filename: 'frame.jpg' });

    const response = await axios.post(`${this.apiUrl}/identify`, form, {
      headers: {
        ...form.getHeaders(),
        'X-API-Key': this.apiKey,
      },
      timeout: 10000,
    });

    const { face_id: externalFaceId, confidence } = response.data;

    if (!externalFaceId || confidence < this.matchThreshold) {
      return null;
    }

    return { externalFaceId, confidence };
  }

  /**
   * Register a face profile with the external face recognition service.
   *
   * @param {string} userId - Internal user ID used as subject label
   * @param {Buffer} imageBuffer - Image data of the user's face
   * @param {string} mimeType - MIME type of the image
   * @returns {Promise<{externalFaceId: string}>}
   */
  async registerFace(userId, imageBuffer, mimeType = 'image/jpeg') {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Face recognition service is not configured');
    }

    const form = new FormData();
    form.append('image', imageBuffer, { contentType: mimeType, filename: 'profile.jpg' });
    form.append('subject', userId);

    const response = await axios.post(`${this.apiUrl}/register`, form, {
      headers: {
        ...form.getHeaders(),
        'X-API-Key': this.apiKey,
      },
      timeout: 15000,
    });

    return { externalFaceId: response.data.face_id };
  }

  /**
   * Delete a face profile from the external face recognition service.
   *
   * @param {string} externalFaceId - The external face ID to delete
   * @returns {Promise<void>}
   */
  async deleteFace(externalFaceId) {
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Face recognition service is not configured');
    }

    await axios.delete(`${this.apiUrl}/faces/${externalFaceId}`, {
      headers: { 'X-API-Key': this.apiKey },
      timeout: 10000,
    });
  }

  /**
   * Process a batch of CCTV frames and identify all recognizable faces.
   * Returns an array of matches (each with externalFaceId and confidence).
   *
   * @param {Buffer[]} frames - Array of image buffers from CCTV
   * @param {string} mimeType - MIME type for all frames
   * @returns {Promise<Array<{externalFaceId: string, confidence: number}>>}
   */
  async processBatchFrames(frames, mimeType = 'image/jpeg') {
    const results = [];
    const seen = new Set();

    for (const frame of frames) {
      try {
        const match = await this.identifyFromImage(frame, mimeType);
        if (match && !seen.has(match.externalFaceId)) {
          seen.add(match.externalFaceId);
          results.push(match);
        }
      } catch {
        // Skip frames that fail recognition
      }
    }

    return results;
  }
}

module.exports = new FaceRecognitionService();

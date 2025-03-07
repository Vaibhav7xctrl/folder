import axios from 'axios';

export interface Evidence {
  Name: string;
  Type: string;
  ID: string;
  Location: string;
  Source: string;
  Timestamp: string;
  CID: string;
  GroupID: string;

}
export interface Report {
  Name: string;
  Type: string;
  ID: string;
  Timestamp: string;
  CID: string;
  GroupID: string;

}

const API_BASE_URL = 'http://localhost:4001/api'; // Ensure this matches your backend URL

export const fabricService = {

  //Method to add evidence
  async addEvidence(evidence: Omit<Evidence, 'ID' | 'Timestamp'>): Promise<Evidence> {
    const response = await axios.post(`${API_BASE_URL}/evidence`, evidence);
    return response.data;
  },

  //Method to record a request
  async recordRequest(evidenceId: string, userId: string, timestamp:string): Promise<Report> {
    const response = await axios.post(`${API_BASE_URL}/record-request`, {
      evidenceId,
      userId,
      timestamp
    });
    return response.data;
  },
  async addReport (report: Omit<Report, 'ID' | 'Timestamp'>): Promise<Report> {
    const response = await axios.post(`${API_BASE_URL}/report`, report);
    return response.data;
  }
};

"use client";
import React from "react";
import { Collapse } from "antd";
import { Button } from "antd";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
// Hardcoded case data
const cases = [
  {
    id: "1",
    caseName: "Burglary Investigation",
    assignedLEO: "Officer John Doe",
    dateAssigned: "2025-02-28",
    caseStatus: "Open",
    evidence: [
      { fileName: "security_footage.mp4", type: "Video", cid: "Qm123ABC" },
      { fileName: "fingerprint_scan.pdf", type: "PDF", cid: "Qm456DEF" },
      { fileName: "witness_statement.txt", type: "Text", cid: "Qm789GHI" },
    ],
  },
  {
    id: "2",
    caseName: "Cyber Fraud Case",
    assignedLEO: "Officer Jane Smith",
    dateAssigned: "2025-02-27",
    caseStatus: "Under Investigation",
    evidence: [
      { fileName: "transaction_logs.csv", type: "CSV", cid: "QmAAA111" },
      { fileName: "suspect_ip_report.pdf", type: "PDF", cid: "QmBBB222" },
    ],
  },
  {
    id: "3",
    caseName: "Homicide Case",
    assignedLEO: "Officer Alex Brown",
    dateAssigned: "2025-02-25",
    caseStatus: "Closed",
    evidence: [
      { fileName: "autopsy_report.pdf", type: "PDF", cid: "QmCCC333" },
      { fileName: "crime_scene_photos.zip", type: "ZIP", cid: "QmDDD444" },
      { fileName: "suspect_interview.mp3", type: "Audio", cid: "QmEEE555" },
    ],
  },
];

export default function CaseList() {
  return (
    <>
    <Header title="Case List" />
    <Collapse
      size="large"
      items={cases.map((caseItem) => ({
        key: caseItem.id,
        label: `${caseItem.id} - ${caseItem.caseName}`,
        children: (
          <div>
            <p><strong>Assigned LEO:</strong> {caseItem.assignedLEO}</p>
            <p><strong>Date Assigned:</strong> {caseItem.dateAssigned}</p>
            <p><strong>Case Status:</strong> {caseItem.caseStatus}</p>

            <h4>Uploaded Evidence:</h4>
            <ul>
              {caseItem.evidence.map((evidence, index) => (
                <li key={index}>
                  <strong>{evidence.fileName}</strong> ({evidence.type})  
                  <br />
                  CID: {evidence.cid}  
                  <br />
                  <Button type="link" href={`https://ipfs.io/ipfs/${evidence.cid}`} target="_blank">
                    View Evidence
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ),
      }))}
    />
    <Footer projectName="Blockchain-Powered Digital Evidence Management" />
    </>
  );
}



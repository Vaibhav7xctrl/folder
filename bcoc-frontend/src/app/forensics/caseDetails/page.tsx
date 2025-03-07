"use client";

import { useState } from "react";
import "./styles.css";
import { Button, Form, Input, message } from "antd"; // Added message for notifications
import { PinataSDK } from "pinata-web3";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Progress } from "antd";
import { Table, Tag } from 'antd';
import Link from "next/link";
import { Report, fabricService } from "../../services/fabricService";
interface PinListItem {
  id: string; // Add this
  ipfs_pin_hash: string; // Add this
  size: number;
  date_pinned: string; // Add this
  mime_type: string; // Add this
  metadata: {
    name: string;
    keyvalues: null | { [key: string]: any }; // Optional, based on your data
  };
  // Add other properties if needed
}
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'IPFS Pin Hash',
    dataIndex: 'ipfs_pin_hash',
    key: 'ipfs_pin_hash',
  },
  {
    title: 'Size (bytes)',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Date Pinned',
    dataIndex: 'date_pinned',
    key: 'date_pinned',
    render: (date_pinned: string) => new Date(date_pinned).toLocaleString(),
  },
  {
    title: 'MIME Type',
    dataIndex: 'mime_type',
    key: 'mime_type',
  },
  {
    title: 'File Name',
    dataIndex: ['metadata', 'name'],
    key: 'file_name',
  },
];

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

export default function Home() {
  const [groupId, setGroupId] = useState("");
  const [fetchedFiles, setFetchedFiles] = useState<PinListItem[]>([]);
  const [CID, setCID] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  // NEW STATE VARIABLES FOR REPORT UPLOAD FEATURE
  const [reportUploading, setReportUploading] = useState(false);
  const [reportUploadProgress, setReportUploadProgress] = useState(0);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportGroupId, setReportGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchFiles = async () => {
    if (!groupId) {
      message.error("Group ID is required");
      return;
    }
    try {
      const files = await pinata.listFiles().group(groupId);
      console.log("Fetched Files:", files);
      setFetchedFiles(files as unknown as PinListItem[]);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFetchedFiles([]);
      message.error("Failed to fetch files");
    }
  };

  const handleFetchFile = async () => {
    if (!CID) {
      message.error("CID is required");
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${CID}`;
      console.log("File URL:", url);
      setFileUrl(url);
  
      // Record the evidence access
      const userId = "user123"; // Replace with actual user ID from your auth system
      const timestamp = new Date().toISOString();
      await fabricService.recordRequest(CID, userId,timestamp);
  
    } catch (error) {
      console.error("Error fetching file or recording request:", error);
      setFileUrl("");
      message.error("Failed to fetch file or record request");
    }
  };

  // NEW FUNCTION: handleReportUpload for uploading forensic analysis reports
  const handleReportUpload = async (values: any) => {
    try {
      if (!reportFile) {
        message.error("No report file selected");
        return;
      }
      setReportUploading(true);
      setReportUploadProgress(0);
  
      const formData = new FormData();
      formData.append("file", reportFile);
  
      const progressInterval = setInterval(() => {
        setReportUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 500);
  
      const fileResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });
  
      clearInterval(progressInterval);
      setReportUploadProgress(100);
  
      const fileData = await fileResponse.json();
      if (!fileResponse.ok || !fileData.IpfsHash) {
        throw new Error("Report upload to Pinata failed");
      }
  
      const ipfsHash = fileData.IpfsHash;
  
      // Add the report to the specified group
      const addToGroupResponse = await fetch(`https://api.pinata.cloud/groups/${reportGroupId}/cids`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cids: [ipfsHash] }),
      });
  
      if (!addToGroupResponse.ok) {
        throw new Error("Failed to add report to group");
      }
      const report: Report = {
        Name: reportFile.name,
        Type: reportFile.type,
        ID: values.ID,
        GroupID: groupId,
        CID: ipfsHash,
        Timestamp: new Date().toISOString(),
      };

      await fabricService.addReport(report);
  
      message.success(`Report uploaded successfully! IPFS Hash: ${ipfsHash}`);
    } catch (error) {
      console.error("Report upload error:", error);
      message.error("Trouble uploading report");
    } finally {
      setReportUploading(false);
      setReportUploadProgress(0);
    }
  };

  return (
    <>
    <Header title="Case Details" />
    <div className="wrapper-display">
  <div className="fetch-files-container">
    <Form onFinish={handleFetchFiles}>
      <Form.Item
        name="groupId"
        label={<span style={{ color: "#fff", fontSize: "20px" }}>Group ID</span>}
        rules={[{ required: true, message: "Group ID is required" }]}
      >
        <Input
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Fetch Files
        </Button>
      </Form.Item>
    </Form>

    <div id="fileList">
      {fetchedFiles.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <Table
                columns={columns}
                dataSource={fetchedFiles}
                rowKey="id"
                style={{ color: '#fff' }}
                pagination={{
                  pageSize: 5, // Display 5 rows per page
                  showSizeChanger: false, // Hide the option to change page size
                  total: fetchedFiles.length,
                }}
              />
      )}
    </div>
  </div>

  <div className="link-container">
  <Form onFinish={handleFetchFile}>
    <Form.Item
      label={<span style={{ color: "#fff", fontSize: "20px" }}>Group ID</span>}
      name="groupId"
      rules={[{ required: true, message: "Group ID is required" }]}
    >
      <Input value={CID} onChange={(e) => setCID(e.target.value)} />
    </Form.Item>
    <Form.Item label=" ">
      <Button type="primary" htmlType="submit" loading={loading}>
        Fetch File
      </Button>
    </Form.Item>
  </Form>

  {fileUrl ? (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "#fff", fontSize: "18px" }}>Fetched File:</h3>
      <a
        href={fileUrl.startsWith('http') ? fileUrl : `https://${fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1890ff", fontSize: "16px", wordBreak: "break-all" }}
      >
        {fileUrl}
      </a>
    </div>
  ) : (
    <div style={{ marginTop: "20px" }}>
      <p style={{ color: "#fff", fontSize: "16px" }}>No file found. Please check the Group ID and try again.</p>
    </div>
  )}
</div>
</div>

     <div className="report-container">
      <Form
  onFinish={handleReportUpload}
  initialValues={{ variant: "filled" }}
  style={{
    background: "#000",
    padding: "20px",
    borderRadius: "8px",
    color: "#fff",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
  }}
>
  <Form.Item
    label={<span style={{ color: "#fff", fontSize: "20px" }}>Group ID</span>}
    name="reportGroupId"
    rules={[{ required: true, message: "Group ID is required" }]}
  >
    <Input
      style={{ background: "#222", color: "#fff", border: "1px solid #444" }}
      value={reportGroupId}
      onChange={(e) => setReportGroupId(e.target.value)}
    />
  </Form.Item>

  <Form.Item
    label={<span style={{ color: "#fff", fontSize: "20px" }}>Select Report File</span>}
    name="reportFile"
    rules={[{ required: true, message: "Report file is required" }]}
  >
    <Input
      type="file"
      onChange={(e) => e.target.files && setReportFile(e.target.files[0])}
      style={{ color: "#fff" }}
    />
    {reportFile && (
      <p style={{ color: "#fff" }}>Selected file: {reportFile.name}</p>
    )}
  </Form.Item>

  {/* Progress Bar */}
  {reportUploading && (
    <Progress
      percent={reportUploadProgress}
      strokeColor="#fff"
      style={{ marginBottom: "20px" }}
    />
  )}

  <Form.Item style={{ textAlign: "center" }}>
    <Button
      type="primary"
      htmlType="submit"
      loading={reportUploading}
      style={{ background: "#444", border: "none", width: "100%" }}
    >
      Upload Report
    </Button>
  </Form.Item>
</Form>
</div>
      
    </>
  );
}
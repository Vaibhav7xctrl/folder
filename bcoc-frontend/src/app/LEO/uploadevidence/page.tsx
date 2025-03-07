"use client";

import { useState } from "react";
import { Upload, Button, message, Form, Input, Progress } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Evidence, fabricService } from "../../services/fabricService";

interface NewEvidence {
  Location: string;
  Source: string;
  CID: string;
}

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const handleFileSelect = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(files?.[0] || null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!selectedFile) {
        message.error("No file selected");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const pinataUploadResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      const fileData = await pinataUploadResponse.json();
      if (!pinataUploadResponse.ok || !fileData.IpfsHash) {
        throw new Error("File upload to Pinata failed");
      }

      const groupId = values.GroupID;
      const ipfsHash = fileData.IpfsHash;

      const addToGroupResponse = await fetch(`https://api.pinata.cloud/groups/${groupId}/cids`, {
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

      const evidence: Evidence = {
        Name: selectedFile.name,
        Type: selectedFile.type,
        ID: values.ID,
        GroupID: groupId,
        Location: values.Location,
        Source: values.Source,
        CID: ipfsHash,
        Timestamp: new Date().toISOString(),
      };

      await fabricService.addEvidence(evidence);

      message.success(`Evidence uploaded successfully! IPFS Hash: ${ipfsHash}`);
      form.resetFields();
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Trouble uploading files.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header title="Upload Evidence" />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Form
          form={form}
          onFinish={handleSubmit}
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
          <Form.Item label={<span style={{ color: "#fff", fontSize: "20px" }}>Group ID</span>} name="GroupID" rules={[{ required: true, message: "Please input the group ID of the case!" }]}>
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: "#fff", fontSize: "20px" }}>Evidence ID</span>} name="ID" rules={[{ required: true, message: "Please input!" }]}>
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: "#fff", fontSize: "20px" }}>Location</span>} name="Location" rules={[{ required: true, message: "Please input!" }]}>
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: "#fff", fontSize: "20px" }}>Source</span>} name="Source" rules={[{ required: true, message: "Please input!" }]}>
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: "#fff", fontSize: "16px" }}>Select File</span>}>
            <input type="file" onChange={handleFileSelect} accept="image/*,video/*,application/pdf" disabled={uploading} style={{ color: "#fff" }} />
            {selectedFile && <p style={{ color: "#fff" }}>Selected file: {selectedFile.name}</p>}
          </Form.Item>

          {uploading && <Progress percent={uploadProgress} strokeColor="#fff" />}

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" loading={uploading} style={{ background: "#444", border: "none", width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer projectName="LEO" />
    </>
  );
}
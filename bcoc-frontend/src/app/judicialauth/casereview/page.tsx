"use client";
import React, { useState } from "react";
import { Table, Drawer, Button, Tag, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Case {
  key: string;
  caseId: string;
  status: string;
  assignedTo: string;
}

const cases: Case[] = [
  {
    key: "1",
    caseId: "CASE-2025-001",
    status: "Pending Review",
    assignedTo: "Judge A",
  },
  {
    key: "2",
    caseId: "CASE-2025-002",
    status: "Needs Further Analysis",
    assignedTo: "Judge B",
  },
];

const CaseReviewDecisionPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (record: Case) => {
    setSelectedCase(record);
    setDrawerVisible(true);
  };

  const handleAction = (action: string) => {
    if (selectedCase) {
      console.log(`Action: ${action} on Case: ${selectedCase.caseId}`);
    }
    setDrawerVisible(false);
  };

  const columns: ColumnsType<Case> = [
    { title: "Case ID", dataIndex: "caseId", key: "caseId" },
    { title: "Assigned To", dataIndex: "assignedTo", key: "assignedTo" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "Pending Review" ? "blue" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Case) => (
        <Button type="link" onClick={() => showDrawer(record)}>
          Review Case
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Case Review & Decision</Title>
      <Table columns={columns} dataSource={cases} />
      
      <Drawer
        title="Case Details"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedCase && (
          <>
            <Text strong>Case ID:</Text> <Text>{selectedCase.caseId}</Text>
            <br />
            <Text strong>Status:</Text> <Tag color="blue">{selectedCase.status}</Tag>
            <br />
            <Text strong>Assigned To:</Text> <Text>{selectedCase.assignedTo}</Text>
            <br /><br />
            
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAction("Approved")}
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleAction("Rejected")}
              >
                Reject
              </Button>
              <Button
                type="default"
                icon={<ExclamationCircleOutlined />}
                onClick={() => handleAction("Request More Analysis")}
              >
                Request Analysis
              </Button>
            </Space>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default CaseReviewDecisionPage;

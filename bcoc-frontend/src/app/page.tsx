"use client";

import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  Input,
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
} from 'antd';



export default function Home() {
  

  return (
    <>
      <Header title="Upload Evidence" />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Form
          
          initialValues={{ variant: "filled" }}
          style={{
            background: "#000",
            padding: "20px",
            borderRadius: "8px",
            color: "#fff",
            maxWidth: "800px",
            width: "100%",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)"
          }}
        >
          <Form.Item
            label={<span style={{ color: "#fff", fontSize: "20px" }}>Username</span>}
            name="Type"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff", fontSize: "20px" }}>ID</span>}
            name="Location"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>
          <Form.Item name="Role" label="Select Role" rules={[{ required: true, message: 'Please pick a Role' }]}>
      <Radio.Group>
        <Radio value="a">LEO</Radio>
        <Radio value="b">Analyst</Radio>
        <Radio value="c">Judiciary</Radio>
      </Radio.Group>
    </Form.Item>
          
          
        </Form>
      </div>

      <Footer projectName="LEO" />
    </>
  );
}
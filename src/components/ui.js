import React, { useState } from "react";
import { Tabs, Input, Button, Table, Card, Form, Select} from 'antd';
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { TabPane } = Tabs;

const BuyPage = () => {
    // State for input values
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
  
    // Handler for buy button click
    const handleBuy = () => {
      // Your logic for buy functionality here
    };
  
    const formRef = React.useRef(null);
    const onFinish = (values) => {
      console.log(values);
    };
  
  
    return (
      <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish} style={{maxWidth: 600}}>
        <Form.Item name="Price" label="Price" hasFeedback validateStatus="success" rules={[{required: true,},]}>
        <Input value={quantity} style={{width: '80%',}} onChange={(e) => setQuantity(e.target.value)} />
        </Form.Item>
  
        <Form.Item name="Amount" label="Amount" hasFeedback validateStatus="error" rules={[{required: true,},]}>
          <Input value={price} style={{width: '80%',}} onChange={(e) => setPrice(e.target.value)} />
        </Form.Item>
  
        <Form.Item name="buy" rules={[{required: true,},]}>
          <Button onClick={handleBuy}>Buy</Button>
        </Form.Item>
      </Form>
    );
  };
  
  const SellPage = () => {
    // State for current price and quantity
    const [currentPrice, setCurrentPrice] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');
  
    // Handler for sell button click
    const handleSell = () => {
      // Your logic for sell functionality here
    };
  
    // Sample data for recent purchases
    const recentPurchasesData = [
      // Your data for recent purchases here
    ];
  
    const columns = [
      // Define columns for recent purchases table
      // Example: { title: 'Purchase Price', dataIndex: 'purchasePrice', key: 'purchasePrice' },
    ];
  
    return (
      <div>
        <Card>
          <p>Current Price: {currentPrice}</p>
          <p>Current Quantity: {currentQuantity}</p>
        </Card>
        <Button onClick={handleSell}>Sell</Button>
        <Table dataSource={recentPurchasesData} columns={columns} />
      </div>
    );
  };
  
  const PersonalPage = () => {
    // State for active tab (buy or sell)
    const [activeTab, setActiveTab] = useState('buy');
  
    // Sample data for personal buy and sell records
    const personalBuyData = [
      // Your data for personal buy records here
    ];
  
    const personalSellData = [
      // Your data for personal sell records here
    ];
  
    const columns = [
      // Define columns for personal records table
      // Example: { title: 'Transaction Date', dataIndex: 'transactionDate', key: 'transactionDate' },
    ];
  
    return (
      <div>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Buy" key="buy" size="large">
            <Table dataSource={personalBuyData} columns={columns} />
          </TabPane>
          <TabPane tab="Sell" key="sell">
            <Table dataSource={personalSellData} columns={columns} />
          </TabPane>
        </Tabs>
      </div>
    );
  };

export {BuyPage,SellPage,PersonalPage}
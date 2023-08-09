import './App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
//UI组件
import { Tabs, Input, Button, Table, Card, Form, Select} from 'antd';
//钱包插件
import { ConnectButton } from '@rainbow-me/rainbowkit';
//abi
import ERC20 from './abi/ERC20.json';
import TimeFactory from './abi/TimeFactory.json';
import TimeInvest from './abi/TimeInvest.json';
import TimeMiddle from './abi/TimeMiddle.json';
import TimeVault from './abi/TimeVault.json';

const { TabPane } = Tabs;
const { Option } = Select;

const investContract='0x67d2Bd0270C9C08D62aD311BFb36296488214740';
const middleContract='0x57F54b581Ca9027aAB8b00061773509E60A317bF';
const vaultContract='0x9e696C07559f54edfB3CDF1f2505899e7c42643B';
const stableContract='0x7E117B9fd1708601993De45d57EBc1fDad877012';
const futureTokenContract='0x5923228eb8e5A69e165a8716674f1BADc3D9aFed';

const firstContract='0x6b03Fc66979b3f3b044a3EED5669446Fd931716e';//结算时间已结束
const secondContract='0x56c0f52e0e690154E3f8821eA69ef04F518dbeee'; //时间未结束
const thirdContract='0xA78dC940021C721d7406418ac1eb7bf9960e06d7';

const App = () => {

    
const [getAddressGroup,fetchNewAddressGroup] = useState([]);
const [selectedItems1, setSelectedItems1] = useState([]);
const [selectedItems2, setSelectedItems2] = useState([]);

const [quantity, setQuantity] = useState('');
const [price, setPrice] = useState('');

const OPTIONS1 = [getAddressGroup];
const OPTIONS2 = [stableContract];
const filteredOptions1 = OPTIONS1.filter((o) => !selectedItems1.includes(o));
const filteredOptions2 = OPTIONS2.filter((o) => !selectedItems2.includes(o));


const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

//购买者授权已选择的稳定币和create2生成的空投期权合约
const ApproveContract=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
          const connectProvider = new ethers.providers.Web3Provider(ethereum);
          const signer = connectProvider.getSigner();
          const StableContract=new ethers.Contract(stableContract,ERC20.abi,signer);
          const approveAirdropContract=await StableContract.approve(thirdContract,1000);
          const approveAirdropContractTx=await approveAirdropContract.wait();
          if(approveAirdropContractTx.status===1){
            console.log("success",approveAirdropContractTx);
          }else{
            console.log("error");
          }
        }
    }catch(e){
        console.log(e);
    }
}

//铸造稳定币和空投代币
const mint=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
      const connectProvider = new ethers.providers.Web3Provider(ethereum);
      const signer = connectProvider.getSigner();
      const StableContract=new ethers.Contract(stableContract,ERC20.abi,signer);
      const FutureContract=new ethers.Contract(futureTokenContract,ERC20.abi,signer);
      const stableMint=await StableContract.mint();
      const futureMint=await FutureContract.mint();
      const stableMintTx=await stableMint.wait();
      const futureMintTx=await futureMint.wait();
      if(stableMintTx.status===1 && futureMintTx===1){
        console.log("mint",stableMintTx,futureMintTx);
      }else{
        console.log("error");
      }
    }
  }catch(e){
    console.log(e);
  }
}

//设置下一次空投的清算时间和空投代币合约地址
const setNextContractTokenMes=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
      const connectProvider = new ethers.providers.Web3Provider(ethereum);
      const signer = connectProvider.getSigner();
      const Middle=new ethers.Contract(middleContract,TimeMiddle.abi,signer);
      const setNext=await Middle.setCleanTime(100000,futureTokenContract);
      const setNextTx=await setNext.wait();
      if(setNextTx.status===1){
        console.log("success:",setNextTx);
      }else{
        console.log("error");
      }
    }
  }catch(e){
    console.log(e);
  }
}

//测试，用户生成新的空投期权合约
const MagicContract=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const InvestContract=new ethers.Contract(investContract,TimeInvest.abi,signer);
        const newAirdropContract=await InvestContract.magic([stableContract],middleContract,vaultContract);
        const newAirdropContractTx=await newAirdropContract.wait();
        if(newAirdropContractTx.status===1){
            console.log("success");
        }else{
            console.log("error");
        }
    }
    }catch(e){
        console.log(e);
    }
}

//TimeFactory
//购买者出价并质押稳定币
const Buy=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const FactoryContract=new ethers.Contract(thirdContract,TimeFactory.abi,signer);
        const getAmount=document.getElementById("buyAmountId").value;
        const getPrice=document.getElementById("buyPriceId").value;
        console.log("mes:",getPrice,getAmount);
        //第一个传选择的稳定币合约组的位置，第二个传购买价格，第三个传购买数量
        const buyDrop=await FactoryContract.buyPledge(0,getPrice,getAmount);
        const buyDropTx=await buyDrop.wait();
        if(buyDropTx.status===1){
          console.log("success:",buyDropTx);
        }else{
          console.log("error");
        }
    }
    }catch(e){

    }
}

//出售者出售
const Sale=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(thirdContract,TimeFactory.abi,signer);
    //先执行授权操作

    //传入当前出售者选择的空投期权合约获取到的当前最高出价相关信息
    const salePledge=await FactoryContract.SalePledge();
    const salePledgeTx=await salePledge.wait();
    if(salePledgeTx.status===1){
      console.log("success:",salePledgeTx);
    }else{
      console.log("error");
    }
    }
    }catch(e){
        console.log(e);
    }
}

//出售者放入空投代币
const InjectFutureToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedItems1,TimeFactory.abi,signer);
    //出售者授权要空投的代币到目标合约

    //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const inject=await FactoryContract.injectFutureToken();
    const injectTx=await inject.wait();
    if(injectTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
    }
    }catch(e){
        console.log(e);
    }
}

//交易成功，购买者提取空投代币
const BuyerWithdrawFutureToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedItems1,TimeFactory.abi,signer);
    //选择自己预先购买的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const buyerGetToken=await FactoryContract.buyerWithdrawFuture();
    const buyerGetTokenTx=await buyerGetToken.wait();
    if(buyerGetTokenTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
    }
    }catch(e){
        console.log(e);
    }
}

//交易成功，出售者提取稳定币
const SolderWithdrawStableToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedItems1,TimeFactory.abi,signer);
    //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const solderGetToken=await FactoryContract.solderWithdrawStable();
    const solderGetTokenTx=await solderGetToken.wait();
    if(solderGetTokenTx.status===1){
      console.log("success");
    }else{
      console.log("error");
    }
    }
    }catch(e){
        console.log(e);
    }
}

//交易失败，购买者提取违约金或者未产生交易的个人质押的稳定币
const BuyerWithdrawRefund=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const FactoryContract=new ethers.Contract(selectedItems1,TimeFactory.abi,signer);
        //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
        const solderGetRefundToken=await FactoryContract.buyerWithdrawRefund();
        const solderGetRefundTokenTx=await solderGetRefundToken.wait();
        if(solderGetRefundTokenTx.status===1){
            console.log("success");
        }else{
            console.log("error");
        }
    }
    }catch(e){
        console.log(e);
    }
}

//选择相应的空投期权合约，得到个人最近的购买交易记录(max 100)，在个人页面购买页面中
const PersonalBuyRecord=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const currentAddress=await signer.getAddress();
    const FactoryContract=new ethers.Contract(thirdContract,TimeFactory.abi,signer);
    const personalBuyRecord=await FactoryContract.getPersonalBuyRecord(currentAddress);
    console.log("personalBuyRecord:",personalBuyRecord);
    }
  }catch(e){
    console.log(e);
  }
}

//选择相应的空投期权合约，得到个人最近的出售记录(max 100),在个人页面出售页面中
const PersonalSaleRecord=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const currentAddress=await signer.getAddress();
    const FactoryContract=new ethers.Contract(thirdContract,TimeFactory.abi,signer);
    const personalsaleRecord=await FactoryContract.getPersonalSaleRecord(currentAddress);
    console.log("personalsaleRecord:",personalsaleRecord);
    }
  }catch(e){
    console.log(e);
  }
}

 //得到最新的空投合约（max 10）
 const FetchContracts=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const InvestContract=new ethers.Contract(investContract,TimeInvest.abi,signer);
        const getNewAddress=await InvestContract.fetchAll();
        fetchNewAddressGroup(getNewAddress);
        console.log(getNewAddress);
        }
    }catch(e){
        console.log(e);
    }
}


const BuyPage = () => {
    // State for input values
  
    // Handler for buy button click
    const handleBuy = () => {
      // Your logic for buy functionality here
    };
  
    const formRef = React.useRef(null);
    const onFinish = (values) => {
      console.log(values);
    };
  
    return (
      <Form {...layout} ref={formRef} name="control-ref" style={{maxWidth: 600}}>
        <Form.Item name="SelectAidropContract" label="Select Aidrop Contract" validateStatus="success">
        <Select showSearch style={{width: '100%',}} placeholder="Search to airdrop contract"
          options={filteredOptions1.map((item) => ({value: item,label: item,}))}
        />
        </Form.Item>

        {/* <Form.Item name="SelectStableToken" label="Select Stable Token" hasFeedback validateStatus="success" rules={[{required: true,},]}>
            <Select mode="multiple" placeholder="Inserted are removed"  value={selectedItems2}
            onChange={setSelectedItems2} style={{width: '100%',}}
            options={filteredOptions2.map((item) => ({value: item,label: item,}))}/>
        </Form.Item> */}

        <Form.Item name="SelectStableToken" label="Select Stable Token" validateStatus="success">
        <Select showSearch style={{width: '100%',}} placeholder="Search to stable token" 
          options={filteredOptions2.map((item) => ({value: item,label: item,}))}/>
        </Form.Item>

        <Form.Item name="Price" label="Price" hasFeedback validateStatus="success" >
          <input type='text' name='buyPrice' id='buyPriceId'></input>
        </Form.Item>
  
        <Form.Item name="Amount" label="Amount" hasFeedback validateStatus="error" >
          <input type='text' name='buyAmount' id='buyAmountId'></input>
        </Form.Item>
        <Button onClick={ApproveContract}>approve airdrop contract</Button>
        <Button onClick={Buy}>Buy</Button>
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
        <Card style={{width: '80%',}}>
          <Select showSearch style={{width: '100%',}} placeholder="Search to airdrop contract"
            options={filteredOptions1.map((item) => ({value: item,label: item,}))}
          />
          {/* 当用户点击该出售页面时，默认取到当前出价的最高值和当前购买者的该购买数量显示出来 */}
          <p>Current Max Price: {currentPrice}</p>
          <p>Current Quantity: {currentQuantity}</p>
          <Button onClick={ApproveContract}>approve airdrop contract</Button>
          <Button onClick={handleSell}>Sell</Button>
        </Card>
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
        <div>
          {/* 当用户选择好自己参与过的购买或出售过的空投期权合约地址后，当点击buy时，在最下方将为用户搜索用户
            *的最多100条该合约购买记录，同理点击sell时，在最下方将为用户搜索用户的最多100条该合约购买记录
            *（默认用户点击个人页面时为buy），每个用户的购买记录（PersonalBuyRecord），出售记录（PersonalSaleRecord）
            *按用户最新的购买或出售记录排序，每个用户的记录展示用户的购买或出售价格，数量，id号，以卡片的形式展出，并在
            *为用户加上一个选择按钮（不能多选其它），当用户选择时，将该记录的值传入到InjectFutureToken，BuyerWithdrawFutureToken，
            *SolderWithdrawStableToken，BuyerWithdrawRefund对应的合约方法中。
          */}
          <Select showSearch style={{width: '100%',}} placeholder="Search to airdrop contract"
            options={filteredOptions1.map((item) => ({value: item,label: item,}))}
          />
          <p>Fee:</p>
          <Button onClick={InjectFutureToken}>Inject FutureToken</Button>
          <Button >Withdraw StableToken</Button>
          <Button onClick={BuyerWithdrawFutureToken}>Withdraw FutureToken</Button>
        </div>
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

  useEffect(() => {
    PersonalBuyRecord();
    // FetchContracts();
    // setNextContractTokenMes();
    // mint();
  });

  return (
    <div>
      <header>
         <ConnectButton />
      </header>
      <Tabs>
        <TabPane tab="Buy" key="buy">
          <BuyPage />
        </TabPane>
        <TabPane tab="Sell" key="sell">
          <SellPage />
        </TabPane>
        <TabPane tab="Personal" key="personal">
          <PersonalPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;

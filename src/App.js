import './App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
//UI组件
import { Tabs, Input, Button, Table, Card, Form, Select, Col, Row } from 'antd';
//钱包插件
import { ConnectButton } from '@rainbow-me/rainbowkit';
//abi
import ERC20 from './abi/ERC20.json';
import TimeFactory from './abi/TimeFactory.json';
import TimeInvest from './abi/TimeInvest.json';
import TimeMiddle from './abi/TimeMiddle.json';

const { TabPane } = Tabs;
const { Option } = Select;

const investContract='0xE515c7029A7Ff30210c60f4B7e13d8e89D761760';
const middleContract='0x57F54b581Ca9027aAB8b00061773509E60A317bF';
const vaultContract='0x9e696C07559f54edfB3CDF1f2505899e7c42643B';
const stableContract='0x7E117B9fd1708601993De45d57EBc1fDad877012';
const futureTokenContract='0x5923228eb8e5A69e165a8716674f1BADc3D9aFed';

const firstContract='0xe7C7c6325bCE8E34C4FDF61e6782468F04e08FB2';
const secondContract='0xB5e15491e3ECB005547Bc6D3f21c195A9c67876b'; 

const stableContractGroup=[
  '0x7E117B9fd1708601993De45d57EBc1fDad877012',
  '0x5923228eb8e5A69e165a8716674f1BADc3D9aFed'
];
const newContractGroup=[
  '0xe7C7c6325bCE8E34C4FDF61e6782468F04e08FB2',
  '0xB5e15491e3ECB005547Bc6D3f21c195A9c67876b'
]

const App = () => {
  //得到出售者需要质押的空投代币数量
  const [getSoldNeedFuture, setSoldNeedFuture] = useState('');

  const [getAddressGroup,fetchNewAddressGroup] = useState([]);
  //选择期权合约
  const [selectedContract1, setselectedContract1] = useState('');
  const [selectedContract2, setselectedContract2] = useState('');
  const [selectedContract3, setselectedContract3] = useState('');

  //选择稳定币
  const [selectedItems1, setSelectedItems1] = useState('');

  function handleSelectContract1(event) {
    setselectedContract1(event.target.value);
    console.log("Contract1 value:",event.target.value);
  }
  function handleSelectContract2(event) {
    setselectedContract2(event.target.value);
    console.log("Contract2 value:",event.target.value);
  }
  function handleSelectContract3(event) {
    setselectedContract3(event.target.value);
    console.log("Contract3 value:",event.target.value);
  }

  function handleSelectChange1(event) {
    setSelectedItems1(event.target.value);
    console.log("Stable contract:",event.target.value);
  }


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
          const approveAirdropContract=await StableContract.approve('0xe7C7c6325bCE8E34C4FDF61e6782468F04e08FB2',1000);
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
          console.log("success",newAirdropContractTx);
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
        const FactoryContract=new ethers.Contract(selectedContract1,TimeFactory.abi,signer);
        const getAmount=document.getElementById("buyAmountId").value;
        const getPrice=document.getElementById("buyPriceId").value;
        // //传入id
        // const getTradeMes=await FactoryContract.getThing(0);
        // const getBuyNeedAmount=getTradeMes.buyPrice*getTradeMes.buyTotalAmount/1000;
        // setBuyNeedStable(getBuyNeedAmount);
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

//出售者出售并质押保证金
const Sale=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedContract2,TimeFactory.abi,signer);
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
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    //出售者授权要空投的代币到目标合约
    //传入id
    const needDeposite=await FactoryContract.getDepositeFutureAmount();
    setSoldNeedFuture(needDeposite);
    //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const inject=await FactoryContract.injectFutureToken();
    const injectTx=await inject.wait();
    if(injectTx.status===1){
      console.log("success",injectTx);
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
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
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
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
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
        const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
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

//计算出售者需要质押的违约金(稳定币)
const solderNeedDeposite=async(soldPrice,soldAmount)=>{
    let thisAmount = soldPrice*soldAmount/1000;
    if (thisAmount >= 100*10**18 && thisAmount < 1000*10**18) {
      return thisAmount * 0.5;
    } else if (thisAmount >= 1000*10**18 && thisAmount < 10000*10**18) {
      return thisAmount * 0.4;
    } else if (thisAmount > 10000*10**18) {
      return thisAmount * 0.25;
    } else {
      return 0;
    }
}

//协议费用
const Fee=async(amount,price,state)=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(firstContract,TimeFactory.abi,signer);
    const thisFee=await FactoryContract.getTradeFee(amount,price,state);
    console.log("thisFee:",thisFee);
    }
  }catch(e){
    console.log(e);
  }
}

//得到所有允许的稳定币合约地址
const getAllStableToken=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(firstContract,TimeFactory.abi,signer);
    const allStableTokens=await FactoryContract.getAllowedToken();
    console.log("All Allow Stable Token:",allStableTokens);
    }
  }catch(e){
    console.log(e);
  }
}

//得到最新的max价格数据
const getMaxPriceData=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const currentAddress=await signer.getAddress();
    const FactoryContract=new ethers.Contract(firstContract,TimeFactory.abi,signer);
    const getFee=await FactoryContract.getTradeFee(100000000000000,10000000000,true);
    console.log("getFee:",getFee);
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
    const FactoryContract=new ethers.Contract(firstContract,TimeFactory.abi,signer);
    //如果是1则是个人的卖出记录，否则是买入记录
    const personalBuyRecord=await FactoryContract.getPersonalSaleRecord(0,currentAddress);
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
    const FactoryContract=new ethers.Contract(firstContract,TimeFactory.abi,signer);
    const personalsoldRecord=await FactoryContract.getPersonalSaleRecord(1,currentAddress);
    console.log("personalsaleRecord:",personalsoldRecord);
    }
  }catch(e){
    console.log(e);
  }
}

//得到最新的空投合约
const FetchContracts=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        let contractGroup=[];
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const InvestContract=new ethers.Contract(investContract,TimeInvest.abi,signer);
        const getGroupLen=await InvestContract.fetchAll();
        const len = parseInt(getGroupLen._hex,16);
        console.log("getGroupLen",len);
        
        for(let i=0;i<len;i++){
          let newContractMes=await InvestContract.getContractMes(i);
          contractGroup.push(newContractMes);
        }
        console.log("contractGroup",contractGroup);
        }
    }catch(e){
        console.log(e);
    }
}

//查找当前最高的10个出价
const getLastMaxPrice=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    let contractGroup=[];
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedContract1,TimeFactory.abi,signer);
    const thisGroupLen=await FactoryContract.getLen();
    const len = parseInt(thisGroupLen._hex,16);
    for(let i=0;i<len;i++){
      let thisPriceMes=await FactoryContract.getThing(i);
      contractGroup.push(thisPriceMes);
    }
    console.log("thisGroupLen",contractGroup);
    const sortGroup1 = contractGroup.sort((a, b) => a.buyTime._hex - b.buyTime._hex);
    console.log("按时间排序后的数组:",sortGroup1);
    const sortGroup2 = sortGroup1.sort((a, b) => a.buyPrice._hex - b.buyPrice._hex);
    console.log("按价格排序后的数组:",sortGroup2);
    }
  }catch(e){
    console.log(e);
  }
}


const BuyPage = () => {
    const formRef = React.useRef(null);

    return (
      <div className='BuyBox' style={{width:'100%',height:'auto'}}>
        <Form {...layout} ref={formRef} name="control-ref"  style={{maxWidth: '100%'}}>
          <Form.Item name="SelectAidropContract" label="Select Aidrop Contract">
          <select value={selectedContract1} onChange={handleSelectContract1} 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={newContractGroup[0]}>Cyber Contract</option>
            <option value={newContractGroup[1]}>Sei Contract</option>
          </select>
          </Form.Item>

          <Form.Item name="SelectStableToken" label="Select Stable Token" validateStatus="success">
          <select value={selectedItems1} onChange={handleSelectChange1} 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={stableContractGroup[0]}>USDT</option>
            <option value={stableContractGroup[1]}>USDC</option>
          </select>
          </Form.Item>

          <Form.Item name="Price" label="Price" hasFeedback validateStatus="success" >
            <input type='text' align="center" suffix="USDT" name='buyPrice' id='buyPriceId' style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}></input>
          </Form.Item>
    
          <Form.Item name="Amount" label="Amount" hasFeedback validateStatus="error" >
            <input type='text' align="center" name='buyAmount' id='buyAmountId' style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}></input>
          </Form.Item>
          <div style={{
            margin: 'auto',
            width: '40%',}}>
            <Button style={{'margin-left':'30%'}} onClick={ApproveContract}>approve</Button>
            <Button style={{'margin-left':'20%'}} onClick={Buy}>Buy</Button>
          </div>
        </Form>

        <div className='LastMaxBuy10'>

        </div>
      </div>
    );
  };
  
const SellPage = () => {
    // State for current price and quantity
    const [currentPrice, setCurrentPrice] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');
  
  
    // Sample data for recent purchases
    const recentPurchasesData = [
      // Your data for recent purchases here
    ];
  
    const columns = [
      // Define columns for recent purchases table
      // Example: { title: 'Purchase Price', dataIndex: 'purchasePrice', key: 'purchasePrice' },
    ];
  
    return (
      <div style={{width: '100%',}}>
        <Form {...layout} name="control-ref"  style={{maxWidth: '100%'}}>
        <Form.Item name="SelectAidropContract" align="center" label="Select Aidrop Contract">
          <select value={selectedContract2} onChange={handleSelectContract2} 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={newContractGroup[0]}>Cyber Contract</option>
            <option value={newContractGroup[1]}>Sei Contract</option>
          </select>
          </Form.Item>
          {/* 当用户点击该出售页面时，默认取到当前出价的最高值和当前购买者的该购买数量显示出来 */}
          <Form.Item name="CurrentMaxPrice:" align="center" label="Current Price:">
            <Input readOnly suffix="USDT" style={{
              width: '50%',
              height: '25px',
            }}/>
          </Form.Item>
          <Form.Item name="Amount" align="center" label="Current Amount:">
            <Input readOnly suffix="Token" style={{
              width: '50%',
              height: '25px',
            }}/>
          </Form.Item>
          <Form.Item name="StableToken" align="center" label="StableToken:">
          <Input readOnly style={{
              width: '50%',
              height: '25px',
            }}/>
          </Form.Item>
          <div>
            <Button style={{'margin-left':'35%'}} onClick={ApproveContract}>approve</Button>
            <Button style={{'margin-left':'15%'}} onClick={Sale}>Sell</Button>
          </div>
          </Form>
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
      <div style={{width: '100%',}}>
        <div>
          {/* 当用户选择好自己参与过的购买或出售过的空投期权合约地址后，当点击buy时，在最下方将为用户搜索用户
            *的最多100条该合约购买记录，同理点击sell时，在最下方将为用户搜索用户的最多100条该合约购买记录
            *（默认用户点击个人页面时为buy），每个用户的购买记录（PersonalBuyRecord），出售记录（PersonalSaleRecord）
            *按用户最新的购买或出售记录排序，每个用户的记录展示用户的购买或出售价格，数量，id号，以卡片的形式展出，并在
            *为用户加上一个选择按钮（不能多选其它），当用户选择时，将该记录的值传入到InjectFutureToken，BuyerWithdrawFutureToken，
            *SolderWithdrawStableToken，BuyerWithdrawRefund对应的合约方法中。
          */}
          <Form.Item name="SelectAidropContract" label="Select Aidrop Contract" align="center">
          <select value={selectedContract3} onChange={handleSelectContract3} 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={newContractGroup[0]}>Cyber Contract</option>
            <option value={newContractGroup[1]}>Sei Contract</option>
          </select>
          </Form.Item>
          <Form.Item name="FeeShow" label="Fee" align="center">

          </Form.Item>
          <Form.Item name="FutureTokenShow" label="FutureToken" align="center">
            
          </Form.Item>
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
    // setNextContractTokenMes();
    // MagicContract();
    getLastMaxPrice();
    FetchContracts();
  });

  return (
    <>
        <ConnectButton />
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
    </>
  );
};

export default App;

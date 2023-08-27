import './App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import TimeFlowLogo from "./components/timeflow_logo.png";
//UI组件
import { Tabs, Input, Button, Table, Card, Form, Select} from 'antd';
//钱包插件
import { ConnectButton } from '@rainbow-me/rainbowkit';
//abi
import ERC20 from './abi/ERC20.json';
import TimeFactory from './abi/TimeFactory.json';
import TimeInvest from './abi/TimeInvest.json';
import TimeMiddle from './abi/TimeMiddle.json';

//
import {stableContractGroup,airdropContractGroup} from './components/contractAddress';

const { TabPane } = Tabs;
const { Option } = Select;

const investContract='0x8505727565c6f68e8C58C3bcc573437241DC5CBF';
const middleContract='0xF2D266737955714410911fb4511455a104E7651A';
const vaultContract='0xa83b368365F47BB6c1458dBe64FffC8C9a8b4d89';
const stableContract='0x7E117B9fd1708601993De45d57EBc1fDad877012';
const futureTokenContract='0x5923228eb8e5A69e165a8716674f1BADc3D9aFed';


const App = () => {

  //得到出售者需要质押的空投代币数量
  const [getSoldNeedFuture, setSoldNeedFuture] = useState('');

  //选择期权合约
  const [selectedContract1, setselectedContract1] = useState('');
  const [selectedContract2, setselectedContract2] = useState('');
  const [selectedContract3, setselectedContract3] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState('');

  //选择显示个人的出售的所有订单，还是购买的所有订单
  const [activeTab, setActiveTab] = useState('buy');
  //得到个人的所有购买记录
  const [personalBuyRecord,setPersonalBuyRecord] = useState([]);
  //得到个人的所有出售记录
  const [personalSaleRecord,setPersonalSaleRecord] = useState([]);
  //得到原始最高出价记录
  const [thisMaxPriceMes,doMaxPriceMes] = useState([]);
  //得到更改可视后最高的出价记录
  const [getMaxPriceMes,setMaxPriceMes] = useState([]);
  //得到清算时间
  const [getEndTime,setEndTime] = useState('');
  //得到选择的空投合约的清算Number
  const [getEndNumber,setEndNumber] = useState('');
  //得到个人选择的记录
  const [getUserChooseMes,setUserChooseMes] = useState('');

  //选择稳定币
  const [selectedItems1, setSelectedItems1] = useState('');

  //得到当前最高出价的数组
  const [getMaxPriceGroup,setMaxPriceGroup] = useState([]);
  //得到当前最高出价的数组
  const [getMaxPriceGroup2,setMaxPriceGroup2] = useState([]);

  //得到个人选中的事务
  //得到id
  const [getChooseId, setChoosedId] = useState('');
  const choosedTrade = (e,checked) => {
    console.log(`switch to ${checked}`);
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSelectContract1=(event)=>{
    setselectedContract1(event.target.value);
    setTimeout(() => {
      GetClearTime(event.target.value);
      getLastMaxPrice(event.target.value);
    }, 500); 
    console.log("Contract1 value:",event.target.value);
  }
  const handleSelectContract2=(event)=> {
    GetClearTime(event.target.value);
    setselectedContract2(event.target.value);
    setTimeout(() => {
      getLastMaxPrice2(event.target.value);
    }, 200);
    console.log("Contract2 value:",event.target.value);
  }

  const handleSelectContract3=(e)=> {
    setselectedContract3(e.target.value);
    setTimeout(() => {
      GetClearTime(e.target.value);
      if(activeTab==='buy'){
        PersonalBuyRecord(e.target.value);
      }
      if(activeTab==='sell'){
        PersonalSaleRecord(e.target.value);
      }
    }, 200);
    console.log("Contract3 value:",e.target.value);
  }

  const handleSelectChange1=(event)=> {
    setSelectedItems1(event.target.value);
    console.log("Stable contract:",event.target.value);
  }

  //antdesign select
  const handleChange1 = (value) => {
    setselectedContract1(value);
    GetClearTime(value);
    getLastMaxPrice(value);
  };

  const handleChange2 = (value) => {
    console.log(`selected ${value}`);
    GetClearTime(value);
    setselectedContract2(value);
    getLastMaxPrice2(value);
  };

  const handleChange3 = (value) => {
    console.log(`selected ${value}`);
    setselectedContract3(value);
    GetClearTime(value);
    if(activeTab==='buy'){
      PersonalBuyRecord(value);
    }
    if(activeTab==='sell'){
      PersonalSaleRecord(value);
    }
  };



  const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
  };
const getChooseClearNumber=async(chooseContract)=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const MiddleContract=new ethers.Contract(middleContract,TimeMiddle.abi,signer);
    const getUnixClearId=await MiddleContract.getClearId(chooseContract);
    const getClearId=parseInt(getUnixClearId._hex,16);
    console.log("Number:",getClearId);
    return getClearId;
    }
  }catch(e) {

  }
}

//购买者授权已选择的稳定币和create2生成的空投期权合约
const ApproveContract=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
          const connectProvider = new ethers.providers.Web3Provider(ethereum);
          const signer = connectProvider.getSigner();
          const getStableCoinId=document.getElementById('selectStableCoin').value;
          // const getChooseContract=document.getElementById('selectContract1').value;
          console.log("Choosed Stablecoin:",stableContractGroup[getStableCoinId],"Approve Contract:",selectedContract1);
          const StableContract=new ethers.Contract(stableContractGroup[getStableCoinId],ERC20.abi,signer);
            const approveAirdropContract=await StableContract.approve(selectedContract1,1000);
            const approveAirdropContractTx=await approveAirdropContract.wait();
            if(approveAirdropContractTx.status===1){
              alert("success");
            }else{
              alert("error");
            }
        }
    }catch(e){
      console.log(e);
      alert("Approve error");
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
      const setNext=await Middle.setCleanTime(5000,'0x56D0ef57D7f9F40D4f019113472e70Cdc654cE9B',futureTokenContract);
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
        // const thisContract=document.getElementById('selectContract1').value;
        const FactoryContract=new ethers.Contract(selectedContract1,TimeFactory.abi,signer);
        const getAmount=document.getElementById("buyAmountId").value;
        const getPrice=document.getElementById("buyPriceId").value;
        const getStableCoinId=document.getElementById('selectStableCoin').value;
        const thisClearNumber=await getChooseClearNumber(selectedContract1);
        // console.log("mes:",getStableCoinId,getPrice*1000,getAmount*10**18,thisClearNumber);
        //第一个传选择的稳定币合约组的位置，第二个传购买价格，第三个传购买数量,第四个传清算周期
        let a=ethers.BigNumber.from(getAmount);
        let b = ethers.BigNumber.from("1000000000000000000");
        let c=1000*getPrice;
        let unixAmount=a.mul(b);
        let unixPrice=c.toFixed(0);
        console.log("unixAmount and unixPrice:",unixAmount,unixPrice);
        const buyDrop=await FactoryContract.buyPledge(getStableCoinId,unixPrice,unixAmount,thisClearNumber);
        const buyDropTx=await buyDrop.wait();
        if(buyDropTx.status===1){
          alert("success");
        }else{
          alert("error");
        }
    }
    }catch(e){
      console.log(e);
      alert("buy error");
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
    const thisClearNumber=await getChooseClearNumber(selectedContract2);
    // const getThisPriceMes=await FactoryContract.getPointThing(thisMaxPriceMes.id);
    // const newPriceMes=await Promise.all(abc.map(async(item)=>{
    //   const unixTime = (Date.parse(item.time))/1000;
    //   let thisAmount = ethers.BigNumber.from(item.amount).mul(ethers.BigNumber.from(10).pow(18));
    //   console.log("thisAmount:",item.amount,thisAmount);
    //   return{
    //     buyPrice:item.price*1000,
    //     buyTime:unixTime,
    //     buyTotalAmount:thisAmount,
    //     buyerAddress:item.buyer,
    //     finishAmount:item.finishAmount,
    //     solderAddress:item.solder,
    //     tokenAddress:item.StableCoin,
    //     tradeId:item.id,
    //     tradeState:item.state
    //   }
    // }))
    //传入当前出售者选择的空投期权合约获取到的当前最高出价相关信息,第二个传清算周期
    const salePledge=await FactoryContract.SalePledge(thisMaxPriceMes.id,thisClearNumber);
    const salePledgeTx=await salePledge.wait();
    if(salePledgeTx.status===1){
      alert("success:",);
    }else{
      alert("error");
    }
    }
    }catch(e){
      console.log(e);
      alert("sale error");
    }
}

//授权空投的代币
const ApproveFutureToken=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const thisContract=document.getElementById('selectContract3').value;
    const MiddleContract=new ethers.Contract(middleContract,TimeMiddle.abi,signer);
    const futureAddress=await MiddleContract.getFutureTokenAddress();
    const FutureContract=new ethers.Contract(futureAddress,ERC20.abi,signer);
    const FutureApprove=await FutureContract.approve(selectedContract3,100);
    const FutureApproveTx=await FutureApprove.wait();
    if(FutureApproveTx.status===1){
      alert("approve success",selectedContract3);
    }else{
      alert("error");
    }
  }
  }catch(e){
    console.log(e);
    alert("Approve FutureToken failed");
  }
}

//出售者放入空投代币
const InjectFutureToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const CurrentAddress = await signer.getAddress();
    // const thisContract=document.getElementById('selectContract3').value;
    const thisId=document.getElementById('selectRecordId').value;
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    const thisClearNumber=await getChooseClearNumber(selectedContract3);
    //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    console.log("inject id:",thisId);
    const inject=await FactoryContract.injectFutureToken(thisClearNumber,thisId);
    const injectTx=await inject.wait();
    if(injectTx.status===1){
      alert("success",);
    }else{
      alert("error");
    }
    }
    }catch(e){
      console.log(e);
      alert("Inject FutureToken failed");
    }
}

//交易成功，购买者提取空投代币
const BuyerWithdrawFutureToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const thisContract=document.getElementById('selectContract3').value;
    const thisId=document.getElementById('selectRecordId').value;
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    //选择自己预先购买的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const thisClearNumber=await getChooseClearNumber(selectedContract3);
    const buyerGetToken=await FactoryContract.buyerWithdrawFuture(thisClearNumber,thisId);
    const buyerGetTokenTx=await buyerGetToken.wait();
    if(buyerGetTokenTx.status===1){
      alert("success");
    }else{
      alert("error");
    }
    }
    }catch(e){
      console.log(e);
      alert("Buyer withdraw futureCoin failed"+e.message);
    }
}

//交易成功，出售者提取稳定币
const SolderWithdrawStableToken=async()=>{
    try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const thisContract=document.getElementById('selectContract3').value;
    const thisId=document.getElementById('selectRecordId').value;
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    const thisClearNumber=await getChooseClearNumber(selectedContract3);
    //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
    const solderGetToken=await FactoryContract.solderWithdrawStable(thisClearNumber,thisId);
    const solderGetTokenTx=await solderGetToken.wait();
    if(solderGetTokenTx.status===1){
      alert("success");
    }else{
      alert("error");
    }
    }
    }catch(e){
      console.log(e);
      alert("Buyer withdraw stablecoin failed"+e.message);
    }
}

//交易失败，购买者提取违约金或者未产生交易的个人质押的稳定币
const BuyerWithdrawRefund=async()=>{
    try{
        const { ethereum } = window;
        if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        // const thisContract=document.getElementById('selectContract3').value;
        const thisId=document.getElementById('selectRecordId').value;
        const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
        //选择自己预先出售的交易对，第一个传入清算周期也就是对应的期权合约的id），第二个传入自己交易的id
        const thisClearNumber=await getChooseClearNumber(selectedContract3);
        const solderGetRefundToken=await FactoryContract.buyerWithdrawRefund(thisClearNumber,thisId);
        const solderGetRefundTokenTx=await solderGetRefundToken.wait();
        if(solderGetRefundTokenTx.status===1){
          alert("success");
        }else{
          alert("error");
        }
    }
    }catch(e){
      console.log(e);
      alert("Buyer withdraw refund failed"+e.message);
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
const StableFee=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    const getId=document.getElementById('selectRecordId').value;
    // const thisAmoount = parseInt(GetUserTrade(getId).amount);
    console.log("anscoa:",GetUserTrade(getId));
    // const thisFee=await FactoryContract.getTradeFee(thisAmoount,GetUserTrade(getId).price,false);
    // console.log("thisFee:",thisFee);
    }
  }catch(e){
    console.log(e);
  }
}

const FutureFee=async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
    const thisFee=await FactoryContract.getTradeFee(getUserChooseMes.amount,getUserChooseMes.price,true);
    console.log("thisFee:",thisFee);
    }
  }catch(e){
    console.log(e);
  }
}

//得到所有允许的稳定币合约地址
const getAllStableToken=async(chooseContract)=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    const FactoryContract=new ethers.Contract(chooseContract,TimeFactory.abi,signer);
    const allStableTokens=await FactoryContract.getAllowedToken();
    console.log("All Allow Stable Token:",allStableTokens);
    }
  }catch(e){
    console.log(e);
  }
}

//选择相应的空投期权合约，得到个人最近的购买交易记录(max 100)，在个人页面购买页面中
const PersonalBuyRecord=async(chooseContract)=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const thisContract=document.getElementById('selectContract3').value;
    const FactoryContract=new ethers.Contract(chooseContract,TimeFactory.abi,signer);
    //如果是1则是个人的卖出记录，否则是买入记录
    const ThisPersonalBuyRecord=await FactoryContract.getPersonalSaleRecord(0);
    const newsortGroup=await Promise.all(ThisPersonalBuyRecord.map(async(tradeMes) => {
      const startTime=parseInt(tradeMes.buyTime._hex,16);
      const thisTime= new Date(startTime * 1000);
      const getTime = thisTime.toLocaleString();
      return{
        id: parseInt(tradeMes.tradeId._hex,16),
        state: parseInt(tradeMes.tradeState._hex,16),
        time:getTime,
        amount:(parseInt(tradeMes.buyTotalAmount._hex,16))/10**18,
        price:(parseInt(tradeMes.buyPrice._hex,16))/1000.000,
        finishAmount:parseInt(tradeMes.finishAmount._hex,16)/10**18,
        buyer:(tradeMes.buyerAddress).slice(0,5)+"..."+(tradeMes.buyerAddress).slice(-5),
        solder:(tradeMes.solderAddress).slice(0,5)+"..."+(tradeMes.solderAddress).slice(-5),
        StableCoin:(tradeMes.tokenAddress).slice(0,5)+"..."+(tradeMes.tokenAddress).slice(-5)
      }
    }));
    setPersonalBuyRecord(newsortGroup);
    console.log("personalBuyRecord:",newsortGroup);
    }
  }catch(e){
    console.log(e);
  }
}

//选择相应的空投期权合约，得到个人最近的出售记录(max 100),在个人页面出售页面中
const PersonalSaleRecord=async(chooseContract)=>{
  try{
    const { ethereum } = window;
    if(ethereum){
    const connectProvider = new ethers.providers.Web3Provider(ethereum);
    const signer = connectProvider.getSigner();
    // const thisContract=document.getElementById('selectContract3').value;
    const FactoryContract=new ethers.Contract(chooseContract,TimeFactory.abi,signer);
    const ThisPersonalsoldRecord=await FactoryContract.getPersonalSaleRecord(1);
    const newsortGroup=await Promise.all(ThisPersonalsoldRecord.map(async(tradeMes) => {
      const startTime=parseInt(tradeMes.buyTime._hex,16);
      const thisTime= new Date(startTime * 1000);
      const getTime = thisTime.toLocaleString();
      return{
        id: parseInt(tradeMes.tradeId._hex,16),
        state: parseInt(tradeMes.tradeState._hex,16),
        time:getTime,
        amount:(parseInt(tradeMes.buyTotalAmount._hex,16))/10**18,
        price:(parseInt(tradeMes.buyPrice._hex,16))/1000.000,
        finishAmount:parseInt(tradeMes.finishAmount._hex,16)/10**18,
        buyer:(tradeMes.buyerAddress).slice(0,5)+"..."+(tradeMes.buyerAddress).slice(-5),
        solder:(tradeMes.solderAddress).slice(0,5)+"..."+(tradeMes.solderAddress).slice(-5),
        StableCoin:(tradeMes.tokenAddress).slice(0,5)+"..."+(tradeMes.tokenAddress).slice(-5)
      }
    }));
    setPersonalSaleRecord(newsortGroup);
    console.log("personalsaleRecord:",newsortGroup);
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
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const InvestContract=new ethers.Contract(investContract,TimeInvest.abi,signer);
        const contractGroup=await InvestContract.fetchAll();
        console.log("contractGroup",contractGroup);
        }
    }catch(e){
        console.log(e);
    }
}

//查找空投合约当前最高的3个出价（购买页面）
const getLastMaxPrice=async(chooseContractAddress)=>{
  try{
    const { ethereum } = window;
      if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const FactoryContract=new ethers.Contract(chooseContractAddress,TimeFactory.abi,signer);
        const thisPriceMes=await FactoryContract.getThing();
        const newsortGroup=await Promise.all(thisPriceMes.map(async(tradeMes) => {
            const startTime=parseInt(tradeMes.buyTime._hex,16);
            const thisTime= new Date(startTime * 1000);
            const getTime = thisTime.toLocaleString();
            if(parseInt(tradeMes.tradeState._hex,16)===1){
            return{
              id: parseInt(tradeMes.tradeId._hex,16),
              time:getTime,
              amount:(parseInt(tradeMes.buyTotalAmount._hex,16))/10**18,
              price:(parseInt(tradeMes.buyPrice._hex,16))/1000.000,
              finishAmount:parseInt(tradeMes.finishAmount._hex,16)/10**18,
              buyer:(tradeMes.buyerAddress).slice(0,5)+"..."+(tradeMes.buyerAddress).slice(-5),
              solder:(tradeMes.solderAddress).slice(0,5)+"..."+(tradeMes.solderAddress).slice(-5),
              StableCoin:(tradeMes.tokenAddress).slice(0,5)+"..."+(tradeMes.tokenAddress).slice(-5)
            }
            }
        }));
        const sortGroup1 =[...newsortGroup].sort((a, b) => a.time - b.time);
        const sortGroup2 =[...sortGroup1].sort((a, b) => b.price - a.price);
        const slicePriceThree=await sortGroup2.slice(0,3);
        setMaxPriceGroup(slicePriceThree);
        console.log("传出的前三最高价格数据:",slicePriceThree);
        }
  }catch(e){
    console.log(e);
  }
}

//查找空投合约当前最高的3个出价（出售页面）
const getLastMaxPrice2=async(chooseContractAddress)=>{
  try{
    const { ethereum } = window;
      if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const FactoryContract=new ethers.Contract(chooseContractAddress,TimeFactory.abi,signer);
        const thisPriceMes=await FactoryContract.getThing();
        
        console.log("newsortGroup:",thisPriceMes);
        const newsortGroup=await Promise.all(thisPriceMes.map(async(tradeMes) => {
            const startTime=parseInt(tradeMes.buyTime._hex,16);
            const thisTime= new Date(startTime * 1000);
            const getTime = thisTime.toLocaleString();
            if(parseInt(tradeMes.tradeState._hex,16)===1){
            return{
              id: parseInt(tradeMes.tradeId._hex,16),
              state:parseInt(tradeMes.tradeState._hex,16),
              time:getTime,
              amount:(parseInt(tradeMes.buyTotalAmount._hex,16)),
              price:(parseInt(tradeMes.buyPrice._hex,16))/1000.000,
              finishAmount:parseInt(tradeMes.finishAmount._hex,16)/10**18,
              buyer:tradeMes.buyerAddress,
              solder:tradeMes.solderAddress,
              StableCoin:tradeMes.tokenAddress
            }
            }
        }));
        const sortGroup1 =[...newsortGroup].sort((a, b) => a.time - b.time);
        const sortGroup2 =[...sortGroup1].sort((a, b) => b.price - a.price);
        const slicePriceThree = sortGroup2.slice(0,3);
        console.log("max3:",slicePriceThree);
        setMaxPriceGroup2(slicePriceThree);
        doMaxPriceMes(slicePriceThree[0]);
        setMaxPriceMes(slicePriceThree[0]);
        console.log("传出的前三最高价格数据:",slicePriceThree[0]);
    }
  }catch(e){
    console.log(e);
  }
}

//选择的个人记录number
const ChooseContent = async(choosedThisId) =>{
  try {
    let choosedMesGroup=[];
    //获取到选择框的name
    // var choosed=document.getElementsByName("checkedFrame");
    // var arr;
    // for(var i = 0; i< choosed.length; i++){
    //   //判断选择框是否选中的
    //   if(choosed[i].checked){
    //     arr=i;
    //     setChoosedId(arr);
    //     console.log("choosed id:",arr);
    //   }
    // }
    let choosedMes=await GetUserTrade(choosedThisId);
    choosedMesGroup.push(choosedMes);
    const newChoosedMes=await Promise.all(choosedMesGroup.map(async(item)=>{
      return{
        id:parseInt(item.tradeId._hex,16),
        price:parseInt(item.buyPrice._hex,16),
        amount:parseInt(item.buyTotalAmount._hex,16),
        state:parseInt(item.tradeState._hex,16),
      }
    }))
    console.log("newChoosedMes:",newChoosedMes);
    return newChoosedMes;
  }catch (error) {
    console.log(error);
  }
}

//根据选择的个人记录number返回相应记录
const GetUserTrade =async()=>{
  try{
    const { ethereum } = window;
    if(ethereum){
      let record=[];
      const connectProvider = new ethers.providers.Web3Provider(ethereum);
      const signer = connectProvider.getSigner();
      let choosedThisId=document.getElementById('selectRecordId').value;
      if(activeTab==="buy"){
        const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
        //如果是1则是个人的卖出记录，否则是买入记录
        const ThisPersonalBuyRecord=await FactoryContract.getPersonalSaleRecord(0);
        for(let i=0; i<ThisPersonalBuyRecord.length; i++){
          const thisId=parseInt(ThisPersonalBuyRecord[i].tradeId._hex,16);
          if(choosedThisId===thisId){
            console.log("personalBuyRecord[i]:",ThisPersonalBuyRecord[thisId]);
            record.push(ThisPersonalBuyRecord[thisId]);
          }
        }
      }else{
        const FactoryContract=new ethers.Contract(selectedContract3,TimeFactory.abi,signer);
        const ThisPersonalsoldRecord=await FactoryContract.getPersonalSaleRecord(1);
        for(let i=0; i<ThisPersonalsoldRecord.length; i++){
          if(parseInt(ThisPersonalsoldRecord[i].tradeId._hex,16)===choosedThisId){
            console.log("personalsoldRecord[i]:",ThisPersonalsoldRecord[i]);
            record.push(ThisPersonalsoldRecord[i]);
          }
        }
      }
    }
  }
  catch(e){
    console.log("Error:",e);
  }
}

//得到清算周期
const GetClearTime=async(chooseContract)=>{
  try{
    const { ethereum } = window;
      if(ethereum){
        const connectProvider = new ethers.providers.Web3Provider(ethereum);
        const signer = connectProvider.getSigner();
        const MiddleContract=new ethers.Contract(middleContract,TimeMiddle.abi,signer);
        console.log("getChooseClearNumber(chooseContract):",getChooseClearNumber(chooseContract));
        const getThisTime=await MiddleContract.getClearTime(getChooseClearNumber(chooseContract),chooseContract);
        const time=parseInt(getThisTime._hex,16);
        const thisTime= new Date(time * 1000);
        const getTime = thisTime.toLocaleString();
        console.log("当前清算周期:",getTime);
        setEndTime(getTime!=='1970/1/1 08:00:00'?getTime:null);
      }
    }catch(e){

    }
}

const BuyPage = () => {
    const formRef = React.useRef(null);

    return (
      <div className='BuyBox' style={{width:'100%',height:'auto'}}>
        <Form {...layout} ref={formRef} name="control-ref"  style={{maxWidth: '100%'}}>
          <Form.Item name="SelectAidropContract1" label="Select Aidrop Contract">
          {/* <select id='selectContract1' 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={null} disabled={true}>choose airdrop contract</option>
            <option value={airdropContractGroup[0]}>Cyber Contract</option>
            <option value={airdropContractGroup[1]}>Sei Contract</option>
          </select> */}
          <Select value={selectedContract1} allowClear={false} id='selectContract1' style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}} onChange={handleChange1}
            options={[
                {
                  value: `${airdropContractGroup[0]}`,
                  label: 'TFCyber Contract',
                },
                {
                  value: `${airdropContractGroup[1]}`,
                  label: 'TFZksync Contract',
                },
                {
                  value: `${airdropContractGroup[2]}`,
                  label: 'TFSei Contract',
                },
          ]}/>
          </Form.Item>

          <Form.Item name="SelectStableToken" label="Select Stable Token">
          <select  id='selectStableCoin'
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={null} disabled={true}>choose stable token</option>
            <option value={0} key={0}>USDT</option>
            <option value={1} key={1}>USDC</option>
          </select>
          </Form.Item>

          <Form.Item name="Price" label="Price">
            <input type='text' align="center" placeholder='Be accurate to 0.001' name='buyPrice' id='buyPriceId' style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}></input>
          </Form.Item>
    
          <Form.Item name="Amount" label="Amount" >
            <input type='text' align="center" name='buyAmount' placeholder='There can be no decimals' id='buyAmountId' style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}></input>
          </Form.Item>
            <Button style={{width:'8%',
            'margin-left':'40%',
            'margin-right':'2%',}} onClick={ApproveContract}>approve</Button>
            <Button style={{width:'8%',
            'margin-left':'2%',
            'margin-right':'40%',}} onClick={Buy}>Buy</Button>
        </Form>
        <div className='LastMaxBuy10' style={{width:'100%'}}>
          <p className="showTitle" style={{
            'border-top-style':'solid',
            'text-align':'center',
            'font-size': '22px',
            'color': 'rgb(72,61,139)'
          }}>The largest first three price information:</p>
          {getMaxPriceGroup.map((item,index)=>{
              return(
                <span key={index} style={{width:'98%',height:'auto'}}>
                  <Card title={<p>ID:{item!==undefined?item.id:null}</p>} hoverable={true} bordered={true} style={{
                    width:'30%',
                    'margin-left':'1.65%',
                    'margin-right':'1.65%',
                    display: 'inline-table',
                    border:'2px solid #a1a1a1',
                    background:'#dddddd',
                    'border-radius':'10px'
                  }} extra={<p>{item!==undefined?item.time:null}</p>}> 
                    <p>Buy Price:{item!==undefined?item.price:null}</p>
                    <p>Buy Amount:{item!==undefined?item.amount:null}</p>
                    <p>Buyer:{item!==undefined?item.buyer:null}</p>
                    <p>Solder:{item!==undefined?(item.solder==="0x000...00000"?null:item.solder):null}</p>
                  </Card>
                </span>
            )})
          }
        </div>
      </div>
    );
  };
  
const SellPage = () => {
  
    return (
      <div style={{width: '100%',}}>
        <Form {...layout} name="control-ref"  style={{maxWidth: '100%'}}>
        <Form.Item name="SelectAidropContract2" align="center" label="Select Aidrop Contract">
          {/* <select id='selectContract2' value={selectedContract2} onBlur={handleSelectContract2} 
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}}>
            <option value={null} disabled={true}>choose airdrop contract</option>
            <option value={airdropContractGroup[0]}>Cyber Contract</option>
            <option value={airdropContractGroup[1]}>Sei Contract</option>
          </select> */}
          <Select value={selectedContract2} allowClear={false} id="selectedContract2" style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}} onChange={handleChange2}
            options={[
                {
                  value: `${airdropContractGroup[0]}`,
                  label: 'TFCyber Contract',
                },
                {
                  value: `${airdropContractGroup[1]}`,
                  label: 'TFZksync Contract',
                },
                {
                  value: `${airdropContractGroup[2]}`,
                  label: 'TFSei Contract',
                },
          ]}/>
          </Form.Item>
          {/* 当用户点击该出售页面时，默认取到当前出价的最高值和当前购买者的该购买数量显示出来 */}
          <Form.Item name="CurrentMaxPrice:" align="center" label="Current Max Price:">
            <textarea className='ContentThing' align="center" name='buyAmount' id='buyAmountId' readOnly="readonly" style={{
              width: '50%',
              height: '22px',
              padding:'auto',
              'resize':'none',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}>{getMaxPriceMes===undefined?null:getMaxPriceMes.price}</textarea>
          </Form.Item>
          <Form.Item name="Amount" align="center" label="Current Amount:">
            <textarea className='ContentThing' align="center" name='buyAmount' id='buyAmountId' readOnly="readonly" style={{
              width: '50%',
              height: '22px',
              'resize':'none',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}>{getMaxPriceMes===undefined?null:getMaxPriceMes.amount}</textarea>
          </Form.Item>
          <Form.Item name="Buyer" align="center" label="Buyer:">
            <textarea className='ContentThing' align="center" name='buyAmount' id='buyAmountId' readOnly="readonly" style={{
              width: '50%',
              height: '22px',
              'resize':'none',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}>{getMaxPriceMes===undefined?null:getMaxPriceMes.buyer}</textarea>
          {/* {getMaxPriceMes===undefined?null:(getMaxPriceMes.buyer).slice(0,5)+"..."+(getMaxPriceMes.buyer).slice(-5)} */}
          </Form.Item>
          <div>
            <Button style={{width:'8%',
              'margin-left':'40%',
              'margin-right':'2%',}} onClick={ApproveContract}>approve</Button>
            <Button style={{width:'8%',
            'margin-left':'2%',
            'margin-right':'40%',}} onClick={Sale}>Sell</Button>
          </div>
          </Form>
          <div className='LastMaxBuy10' style={{width:'100%'}}>
          <p className="showTitle" style={{
            'border-top-style':'solid',
            'text-align':'center',
            'font-size': '22px',
            'color': 'rgb(72,61,139)'
          }}>The largest first three price information:</p>
          {getMaxPriceGroup2.map((item,index)=>{
              return(
                <span key={index} style={{width:'98%',height:'auto'}}>
                  <Card title={<p>ID:{item!==undefined?item.id:null}</p>} hoverable={true} bordered={true} style={{
                    width:'30%',
                    'margin-left':'1.65%',
                    'margin-right':'1.65%',
                    display: 'inline-table',
                    border:'2px solid #a1a1a1',
                    background:'#dddddd',
                    'border-radius':'10px'
                  }} extra={<p>{item!==undefined?item.time:null}</p>}> 
                    <p>Buy Price:{item!==undefined?item.price:null}</p>
                    <p>Buy Amount:{item!==undefined?item.amount:null}</p>
                    <p>Buyer:{item!==undefined?((item.buyer).slice(0,5)+"..."+(item.buyer).slice(-5)):null}</p>
                    {/* (item.buyer).slice(0,5)+"..."+(item.buyer).slice(-5) */}
                    {/* (item.solder).slice(0,5)+"..."+(item.solder).slice(-5) */}
                    <p>Solder:{item!==undefined?(item.solder==="0x000...00000"?null:((item.solder).slice(0,5)+"..."+(item.solder).slice(-5))):null}</p>
                  </Card>
                </span>
            )})
          }
        </div>
      </div>
    );
  };
  
const PersonalPage = () => {
  
    return (
      <div style={{width: '100%',}}>
        <Form {...layout} name="control-ref"  style={{maxWidth: '100%'}}>
        <Form.Item name="SelectAidropContract3" align="center" label="Select Aidrop Contract">
          {/* <select id="selectContract3" value={selectedContract3}
            style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}} 
              >
            <option value={null} disabled={true}>choose airdrop contract</option>
            <option value={airdropContractGroup[0]} key={airdropContractGroup[0]}>Cyber Contract</option>
            <option value={airdropContractGroup[1]} key={airdropContractGroup[1]}>Sei Contract</option>
          </select> */}
          <Select value={selectedContract3} allowClear={false} id="selectContract3" style={{
              width: '50%',
              height: '25px',
              'outline-style': 'none',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'}} onChange={handleChange3}
            options={[
                {
                  value: `${airdropContractGroup[0]}`,
                  label: 'TFCyber Contract',
                },
                {
                  value: `${airdropContractGroup[1]}`,
                  label: 'TFZksync Contract',
                },
                {
                  value: `${airdropContractGroup[2]}`,
                  label: 'TFSei Contract',
                },
          ]}/>
        </Form.Item>
        <Form.Item name="ChooseId" label="Choose Personal Id" align="center">
          <select id="selectRecordId" style={{
            width: '50%',
            height: '25px',
            'outline-style': 'none',
            border: '2px solid #434343', 
            'border-radius': '8px',
            'font-size': '15px',
            'box-shadow': '2px 3px 5px #fbc2eb'}} >
            {activeTab==='buy'
            ?
            personalBuyRecord.map((item,index)=>{
              return(
                <option value={item.id}>id:{index}</option>
              )
            })
            :
            personalSaleRecord.map((item,index)=>{
              return(
                <option value={item.id} key={item.id}>id:{index}</option>
              )
            })
            }
          </select>
        
        </Form.Item>
        <Form.Item name="FeeShow" label="Withdraw Fee" align="center">
          <textarea className='ContentThing' align="center" name='buyAmount' id='buyAmountId' readOnly="readonly" style={{
              width: '50%',
              height: '22px',
              padding:'auto',
              'resize':'none',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}>{}</textarea>
        </Form.Item>
        <Form.Item name="FutureTokenShow" label="FutureToken Amount" align="center">
          <textarea className='ContentThing' align="center" name='buyAmount' id='buyAmountId' readOnly="readonly" style={{
              width: '50%',
              height: '22px',
              padding:'auto',
              'resize':'none',
              'outline-style': 'none',
              border: '2px solid #434343', 
              'border-radius': '8px',
              'font-size': '15px',
              'box-shadow': '2px 3px 5px #fbc2eb'
            }}>{}</textarea>  
        </Form.Item>
        <Button onClick={ApproveFutureToken} style={{
          'margin-left':'26%',
          'margin-right':'1%',
          width:'8%',}}>approve</Button>
        <Button onClick={InjectFutureToken} style={{
          'margin-left':'1%',
          'margin-right':'1%',
          width:'8%',}}>inject</Button>
        <Button onClick={BuyerWithdrawRefund} style={{
          'margin-left':'1%',
          'margin-right':'1%',
          width:'8%',}}>refund</Button>
        <Button onClick={SolderWithdrawStableToken} style={{
          'margin-left':'1%',
          'margin-right':'1%',
          width:'8%',}}>stable</Button>
        <Button onClick={BuyerWithdrawFutureToken} style={{
          'margin-left':'1%',
          'margin-right':'auto%',
          width:'8%',}}>future</Button>
        <Tabs centered size={"middle"} activeKey={activeTab} onChange={(key)=>setActiveTab(key)}>
          <TabPane tab="BuyMes" key="buy">
          <div className='allContents'>
            {personalBuyRecord.map((item,index)=>{
              return(
                <span key={index} style={{width:'98%',height:'auto'}}>
                  <Card title={<p>ID:{item.id!=='undefined'?item.id:null}</p>} hoverable={true} bordered={true} style={{
                    width:'30%',
                    'margin-left':'1.65%',
                    'margin-right':'1.65%',
                    'margin-top':'10px',
                    'margin-bottom':'10px',
                    display: 'inline-table',
                    border:'2px solid #a1a1a1',
                    background:'#dddddd',
                    'border-radius':'10px'
                  }} extra={<p>{item.time!=='undefined'?item.time:null}</p>}> 
                    {/* <input type="checkBox" value={item.id} name="checkedFrame" 
          onChange={handleOnChange} onClick={ChooseContent}></input> */}
                    <p>state:{item.state!=='undefined'?item.state:null}</p>
                    <p>Buy Price:{item.price!=='undefined'?item.price:null}</p>
                    <p>Buy Amount:{item.amount!=='undefined'?item.amount:null}</p>
                    <p>Buyer:{item.buyer!=='undefined'?item.buyer:null}</p>
                    <p>Solder:{item.buyer!=='undefined'?(item.solder==="0x000...00000"?null:item.solder):null}</p>
                  </Card>
                </span>
              )
            })}
            </div>
          </TabPane>
          <TabPane tab="SellMes" key="sell">
          <div className='allContents'>
          {personalSaleRecord.map((item,index)=>{
              return(
                <span key={index} style={{width:'98%',height:'auto'}}>
                  <Card title={<p>ID:{item.id!=='undefined'?item.id:null}</p>} hoverable={true} bordered={true} style={{
                    width:'30%',
                    'margin-left':'1.65%',
                    'margin-right':'1.65%',
                    'margin-top':'10px',
                    'margin-bottom':'10px',
                    display: 'inline-table',
                    border:'2px solid #a1a1a1',
                    background:'#dddddd',
                    'border-radius':'10px'
                  }} extra={<p>{item.time!=='undefined'?item.time:null}</p>}> 
                    <p>state:{item.state!=='undefined'?item.state:null}</p>
                    <p>Buy Price:{item.price!=='undefined'?item.price:null}</p>
                    <p>Buy Amount:{item.amount!=='undefined'?item.amount:null}</p>
                    <p>Buyer:{item.buyer!=='undefined'?item.buyer:null}</p>
                    <p>Solder:{item.buyer!=='undefined'?(item.solder==="0x000...00000"?null:item.solder):null}</p>
                  </Card>
                </span>
              )
            })}  
          </div>
          </TabPane>
        </Tabs>
        </Form>
      </div>
    );
  };

  useEffect(() => {
    // setNextContractTokenMes();
    // MagicContract();
    FetchContracts();
  });

  return (
    <div className='Box' style={{
      width:'100%',
      height:'800px',
      position:'absolute',
      'background-image': 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%',
      }}>
        <ul style={{'display':'inline-block'}}>
          <li><img className='logoStyle' src={TimeFlowLogo} alt=""></img></li>
          <li style={{'margin-left':'30%'}}>clear time:{getEndTime}</li>
          <var style={{'display':'inline','float':'right'}} ><ConnectButton /></var>
        </ul>
        <Tabs centered size={"large"}>
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

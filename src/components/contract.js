import React from 'react';
import ReactDOM from 'react-dom/client';
import { ethers } from "ethers";

//abi
import ERC20 from './abi/ERC20.json';
import TimeFactory from './abi/TimeFactory.json';
import TimeInvest from './abi/TimeInvest.json';
import TimeMiddle from './abi/TimeMiddle.json';
import TimeVault from './abi/TimeVault.json';



const ApproveToken=async()=>{

}

const MagicContract=async()=>{
    
    const investContract=new ethers.Contract();
    const newAirdropContract=await investContract.magic();
    const newAirdropContractTx=await newAirdropContract.wait();
    if(newAirdropContractTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//TimeFactory
//购买者出价并质押稳定币
const Buy=async()=>{
    const FactoryContract=new ethers.Contract();
    const buyDrop=await FactoryContract.buyPledge();
    const buyDropTx=await buyDrop.wait();
    if(buyDropTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//出售者出售
const Sale=async()=>{
    const FactoryContract=new ethers.Contract();
    const salePledge=await FactoryContract.SalePledge();
    const salePledgeTx=await salePledge.wait();
    if(salePledgeTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//出售者放入空投代币
const InjectFutureToken=async()=>{
    const FactoryContract=new ethers.Contract();
    const inject=await FactoryContract.injectFutureToken();
    const injectTx=await inject.wait();
    if(injectTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//交易成功，购买者提取空投代币
const BuyerWithdrawFutureToken=async()=>{
    const FactoryContract=new ethers.Contract();
    const buyerGetToken=await FactoryContract.buyerWithdrawFuture();
    const buyerGetTokenTx=await buyerGetToken.wait();
    if(buyerGetTokenTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//交易成功，出售者提取稳定币
const SolderWithdrawStableToken=async()=>{
    const FactoryContract=new ethers.Contract();
    const solderGetToken=await FactoryContract.solderWithdrawStable();
    const solderGetTokenTx=await solderGetToken.wait();
    if(solderGetTokenTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

//交易失败，购买者提取违约金或者未产生交易的个人质押的稳定币
const SenderWithdrawRefund=async()=>{
    const FactoryContract=new ethers.Contract();
    const solderGetRefundToken=await FactoryContract.buyerWithdrawRefund();
    const solderGetRefundTokenTx=await solderGetRefundToken.wait();
    if(solderGetRefundTokenTx.status===1){
        console.log("success");
    }else{
        console.log("error");
    }
}

export {ApproveToken,MagicContract,Buy,Sale,InjectFutureToken,BuyerWithdrawFutureToken,SolderWithdrawStableToken,SenderWithdrawRefund};
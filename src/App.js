import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect, useCallback } from "react";



import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Designs from './components/DesignersHub';
import NewDesigns from './components/NewDesigns';
import Designershub from './contract/Designershub.abi.json';
 
 
 




const ERC20_DECIMALS = 18;


const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";




function App() {

  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [designs, setDesigns] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
     console.log("Error Occurred");
     
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(Designershub, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }

  },[address, kit]);

  
  const getDesigns = (async () => {
    const designersLength = await contract.methods.getDesignsLength().call();
    const _designs = []
    for (let index = 0; index < designersLength; index++) {
      console.log(designersLength);
      let _designs = new Promise(async (resolve, reject) => {
      let designs = await contract.methods.getDesigns(index).call();

        resolve({
          index: index,
          owner: designs[0],
          expertise: designs[1],
          name: designs[2],
          onlinePortfolio: designs[3],
          location: designs[4],
          yearsExperience: designs[5],
          price: designs[6],
          designTeam: designs[7]
         
             
        });
      });

      _designs.push(_designs);
    }

    const designs = await Promise.all(_designs);
    setDesigns(designs);
    console.log(designs)
  });

  const addDesign = async (
    _expertise,
    _name,
    _onlinePortfolio,
    _location,
    _yearsExperience,
    price,
    _designTeam
  ) => {

    const _price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();
    
    try {
      await contract.methods
        .uploadDesignjobs(_expertise, _name, _onlinePortfolio, _location, _yearsExperience, _price, _designTeam)
        .send({ from: address });
       getDesigns();
    } catch (error) {
      console.log(error);
    }
  };

  const removeDesign = async (_index) => {
    try {
      await contract.methods.removeDesignjobs(_index).send({ from: address });
      getDesigns();
      getBalance();
    } catch (error) {
      alert(error);
    }};

     
    const buyDesigns = async (_index,) => {
      try {
        const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      
        
        await cUSDContract.methods
          .approve(contractAddress, designs[_index].price)
          .send({ from: address });
        await contract.methods.buyDesigns(_index).send({ from: address });
        getDesigns();
        getBalance();
        alert("you have purchased a gig")
      } catch (error) {
        console.log(error)
      }};


    useEffect(() => {
      connectToWallet();
    }, []);
  
    useEffect(() => {
      if (kit && address) {
        getBalance();
       
      }
    }, [kit, address]);
  
    useEffect(() => {
      if (contract) {
        getDesigns();
      }
    }, [contract]);  

    return (
      <div>
        <Navbar balance = {cUSDBalance} />
        <Designs
        designs = {designs}
        buyDesigns = {buyDesigns}
        removeDesign= {removeDesign}
         
        />
         <NewDesigns uploadDesignjobs = {addDesign}
         
/>
      </div>
      )


}
export default App;

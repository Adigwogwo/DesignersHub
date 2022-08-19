import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect, useCallback } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Profiles from "./components/ProfilesHub";
import UploadProfile from "./components/NewProfile";
import { Uploadjobs } from "./components/NewJobs";
import Designershub from "./contract/Designershub.abi.json";
import { Projects } from "./components/JobsHub";



const ERC20_DECIMALS = 18;

const contractAddress = "0xA0b581201C40D3Bd74D55F3cE3ff0504CC3Bd942";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [projects, setProjects] = useState([]);

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
  }, [address, kit]);

  const getProfiles = async () => {
    const profilesLength = await contract.methods.getDesignsLength().call();
    const _profiles = [];
    for (let index = 0; index < profilesLength; index++) {
      let currentProfile = new Promise(async (resolve, reject) => {
        let profiles = await contract.methods.getDesigner(index).call();
        resolve({
          index: index,
          designer: profiles[0],
          expertise: profiles[1],
          name: profiles[2],
          onlinePortfolio: profiles[3],
          location: profiles[4],
          yearsExperience: profiles[5],
          price: profiles[6],
          onContract: profiles[7],
        });
      });
      _profiles.push(currentProfile);
    }

    const profiles = await Promise.all(_profiles);
    setProfiles(profiles);
  };

      const getJobs = async () => {
        const jobsLength = await contract.methods.getProjectsLength().call();
        const _projects = [];
        for (let index = 0; index < jobsLength; index++) {
          let currentProject = new Promise(async (resolve, reject) => {
            let project = await contract.methods.getJobs(index).call();
            resolve({
              index: index,
              admin: project[0],
              winner: project[1],
              name: project[2],
              description: project[3],
              available: project[4],
              completed: project[5],
              applicants: project[6],
            });
          });

      _projects.push(currentProject);
    }

    const projects = await Promise.all(_projects);
    setProjects(projects);
  };

  const uploadProfile = async (
    _expertise,
    _name,
    _onlinePortfolio,
    _location,
    _yearsExperience,
    price
  ) => {
    const _price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();

    try {
      await contract.methods
        .uploadProfile(
          _expertise,
          _name,
          _onlinePortfolio,
          _location,
          _yearsExperience,
          _price
        )
        .send({ from: address });
      getProfiles();
      getJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadJobs = async (
    _name,
    _description
  ) => {

    try {
      await contract.methods
        .uploadDesignjobs(
          _name,
         _description
        )
        .send({ from: address });
      getProfiles();
      getJobs();
    } catch (error) {
      console.log(error);
    }
  };


  const removeProfile = async (_index) => {
    try {
      await contract.methods.removeDesigner(_index).send({ from: address });
      getProfiles();
      getJobs();
      getBalance();
    } catch (error) {
      alert(error);
    }
  };
  const applyToproject = async (_index) => {
    try {
      await contract.methods.ApplyToProject(_index).send({ from: address });
      getProfiles();
      getJobs();
      getBalance();
    } catch (error) {
      alert(error);
    }
  };

  const selectDesigner = async (_index, _address) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = profiles[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.ChooseDesigner(_index).send({ from: address });
      getProfiles();
      getJobs();
      getBalance();
      alert("you have successfully hire this designer");
    } catch (error) {
      alert(error);
    }};

  const endContract = async (_index) => {
    try {
      await contract.methods.endContract(_index).send({ from: address });
      getProfiles();
      getJobs();
      getBalance();
    } catch (error) {
      alert(error);
    }
  };




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
      getProfiles();
      getJobs();
    }
  }, [contract]);

  return (
    <div>
      <Navbar balance={cUSDBalance} />
      <Profiles
        profiles={profiles}
        removeProfile={removeProfile}
        walletAddress={address}
      />
      <Projects
      projects={projects}
      walletAddress={address}
      apply={applyToproject}
      choose={selectDesigner}
      end={endContract}
      
      />
      <UploadProfile uploadProfile={uploadProfile} />
      <Uploadjobs uploadJobs={uploadJobs} />
    </div>
  );
}
export default App;

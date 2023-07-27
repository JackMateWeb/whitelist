import {useState, useEffect} from "react";
import {ethers} from "ethers";
import WHITELIST_CONTRACT_ADDRESS from "./constants/index";
import whiteJson from "./constants/Whitelist.json";
import "./App.css";

function App() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletAccount, setWalletAccount] = useState(null);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  const [whiteContract, setWhiteContract] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setWalletAccount(accounts[0]);
      getNumberOfWhitelisted();
      checkIfAddressInWhitelist(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumberOfWhitelisted = async() => {
    try {
      const num = await whiteContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(Number(num));
    } catch (error) {
      console.error(error);
    }
  }

  const checkIfAddressInWhitelist = async (walletAccount) => {
    try {
      console.log("Connected", walletAccount);
      const _joinedWhitelist = await whiteContract.isAddressInWhitelist(walletAccount);
      console.log(`_joinedWhitelist: ${_joinedWhitelist}`);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const addAddressToWhitelist = async() => {
    try {
      const tx = await whiteContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  }

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {

    const initGameContract = async () => {
      const { ethereum } = window;
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const singer = await provider.getSigner();
        const contract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS, whiteJson, singer);
        setWhiteContract(contract);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (!walletAccount) {
      initGameContract();
    }

  }, [walletAccount]);


  /*
    renderButton: Returns a button based on the state of the dapp
  */
    const renderButton = () => {

      if (walletAccount) {
        if (joinedWhitelist) {
          return (
            <div className="description">Thanks for joining the Whitelist!</div>
          );
        } else if (loading) {
          return <button className="button">Loading...</button>;
        } else {
          return (
            <button onClick={addAddressToWhitelist} className="button">
              Join the Whitelist
            </button>
          );
        }
      } else {
        return (
          <button onClick={connectWallet} className="button">
            Connect your wallet
          </button>
        );
      }
    };
  

  return (
    <div>
      <header>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </header>
      <div className="main">
        <div>
          <h1 className="title">Welcome to Crypto Devs!</h1>
          <div className="description">
            Its an NFT collection for developers in Crypto.
          </div>
          <div className="description">
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className="image" src="crypto-devs.svg" alt="devs" />
        </div>
      </div>

      <footer className="footer">Made with &#10084; by Crypto Devs</footer>
    </div>
  );
}

export default App;

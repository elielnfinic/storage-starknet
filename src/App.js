import './App.css';
import starknet,{Provider, stark} from "starknet";
import {connect, disconnect} from "get-starknet";
import {useState} from "react";

function App() {
  const [value, setValue] = useState("");

  const provider = new Provider({
    sequencer : {
      network : 'goerli-alpha'
    }
  });

  const connectWallet = async () => {
    //const conn = await connectWallet();
    const starknet = await connect();
    await starknet?.enable({starknetVersion : "v4"});
    const provider = starknet.account;
    console.log(provider);
    localStorage.stark_addr = provider.address;
    localStorage.stark_provider = provider.provider;
    localStorage.stark_signer = provider.signer;
    
  }

  let user_addr = "";

  if(localStorage.stark_addr && localStorage.stark_provider){
    user_addr = localStorage.stark_addr;
  }

  const getValue = async () => {
    const res = await provider.callContract({
      contractAddress:"0x6d37637344d803be340215446c6efbd0201dead08b699949b433d5864d443bf",
      entrypoint:"get_balance",
      calldata:[]
    });
    
    console.log(res);
    setValue(parseInt(res.result[0]));
  }

  const sendValue = async () => {
    const res = await provider.callContract({
      contractAddress:"0x6d37637344d803be340215446c6efbd0201dead08b699949b433d5864d443bf",
      entrypoint:"increase_balance",
      calldata:[12]
    });

    console.log(res);
  }

  const logout = async () => {
    if(window.confirm("Are you sure you want to logout")){
      await disconnect();
      localStorage.clear();
      window.location.href = "";
    }
  }

  return (
    <div className="App">

      {user_addr ? <div>Your address is {user_addr}. <button onClick={logout}>Logout</button></div>: <div>
        <button onClick={connectWallet}>Connect your wallet</button>
      </div>}

      <h1>Starknet client</h1>
      <table>
        <tbody>
          <tr><td>Get value</td><td><button type='submit' onClick={getValue}>Get value</button></td><td>{value}</td></tr>
          <tr><td>Set value</td><td><input type="text"/></td><button type='submit' onClick={sendValue}>Submit value</button></tr>
        </tbody>
      </table>

      
    </div>
  );
}

export default App;

import './App.css';
import {useState} from "react";
import {ethers} from "ethers";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, contractABI } from './contract';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState("");
  const [postHash, setPostHash] = useState("");
  const [postId, setPostId] = useState("");
  const [postData, setPostData] = useState(null);

  const connectWallet = async () => {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const contractInstance = new Contract(contractAddress, contractABI, signer);
    setAccount(userAddress);
    setContract(contractInstance);
  };
  
  const registerUser = async () => {
    try {
      const tx = await contract.register(username);
      await tx.wait();
      alert("Registered!");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  const createPost = async () => {
    try {
      const tx = await contract.createPost(postHash);
      await tx.wait();
      alert("Post created!");
    } catch (err) {
      console.error(err);
      alert("Failed to post.");
    }
  };

  const fetchPost = async () => {
    try {
      const post = await contract.getPost(postId);
      setPostData(post);
    } catch (err) {
      console.error(err);
      alert("Post not found.");
    }
  };
  return (
    <div className="App">
      <h2> Decentralized Twitter</h2>

<button onClick={connectWallet}>
  {account ? `Connected: ${account}` : "Connect Wallet"}
</button>

<hr />

<h3>👤 Register</h3>
<input
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
<button onClick={registerUser}>Register</button>

<hr />

<h3>Create Post</h3>
<input
  placeholder="IPFS Hash or text"
  value={postHash}
  onChange={(e) => setPostHash(e.target.value)}
/>
<button onClick={createPost}>Post</button>

<hr />

<h3>🔍 Fetch Post</h3>
<input
  placeholder="Post ID"
  value={postId}
  onChange={(e) => setPostId(e.target.value)}
/>
<button onClick={fetchPost}>Get Post</button>

{postData && (
  <div style={{ marginTop: 20 }}>
    <p><strong>Author:</strong> {postData[0]}</p>
    <p><strong>Timestamp:</strong> {new Date(postData[1] * 1000).toString()}</p>
    <p><strong>Hash:</strong> {postData[2]}</p>
    <p><strong>ID:</strong> {postData[3]}</p>
    <p><strong>Likes:</strong> {postData[4]}</p>
  </div>
)}
    </div>
  );
}

export default App;

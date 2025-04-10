import React from "react";
import axios from "axios";
import { useState } from "react";

const Imageupload = () => {
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadToPinata = async () => {
        if (!file) return alert("Select a file first");
      
        const formData = new FormData();
        formData.append("file", file);
      
       
        const jwt = process.env.REACT_APP_PINATA_JWT || "No JWT found!";
        console.log("JWT:", jwt);

        console.log("JWT:", jwt); // should print Bearer ...
      
        setLoading(true);
        try {
          const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
              maxBodyLength: "Infinity",
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': jwt, // make sure this is correct
              },
            }
          );
      
          setIpfsHash(res.data.IpfsHash);
        } catch (error) {
          console.error("Error uploading to Pinata:", error);
          alert("Upload failed: " + error?.response?.data?.error || error.message);
        } finally {
          setLoading(false);
        }
      };
      
    
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Upload Image to IPFS via Pinata</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br /><br />
            <button onClick={uploadToPinata} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload to IPFS'}
            </button>

            {ipfsHash && (
                <div style={{ marginTop: '2rem' }}>
                    <p><strong>IPFS Hash:</strong> {ipfsHash}</p>
                    <p>
                        View Image: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noreferrer">
                            https://gateway.pinata.cloud/ipfs/{ipfsHash}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Imageupload;
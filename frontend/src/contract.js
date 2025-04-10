export const contractAddress="0xd9145CCE52D386f254917e481eB44e9943F39138";
export const contractABI= [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                }
            ],
            "name": "createPost",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "postId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "author",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                }
            ],
            "name": "postCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_username",
                    "type": "string"
                }
            ],
            "name": "register",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "username",
                    "type": "string"
                }
            ],
            "name": "userRedistered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_postId",
                    "type": "uint256"
                }
            ],
            "name": "getPost",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "postId",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "posts",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "author",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "postedAt",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "users",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "userAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "username",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "postCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
]
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract PostContract{
    int constant MIN_REPUTATION=500;
    uint public postId=0;
    uint public userCount=0;

    address[] public usersArray;
    enum VerificationStatus { Normal, Verified, Misinformation }


    struct User{
        address userAddress;
        string username;
        uint postCount;
        uint[] userPosts;
        int reputation;
        bool isVerified;
    }
    struct post{
        address author;
        uint postedAt;
        string hash;
        uint id;
        uint timestamp;
        uint likes;
        uint dislikes;
        bool isFlagged;
        bool isOriginal;
        VerificationStatus status;
    }



    mapping (uint => bool) public consesed;
    mapping (uint=>post) public posts;
    mapping(address=>bool) public isRegistered;
    mapping(address=>User) public users;

    modifier postExists(uint _postId){
        require(_postId>0 && _postId <= postId, "Post does not exist");
        _;
    }


    event userRedistered(address indexed user, string username);
    event postCreated(uint indexed postId, address indexed author, string hash);
    event userLogged(address indexed user, string username);

    function login() public {
        require(isRegistered[msg.sender],"Kindly register");
        emit userLogged(msg.sender, users[msg.sender].username);
    }
    function register(string memory _username) public {
        require(!isRegistered[msg.sender], "User is already registered");

        isRegistered[msg.sender]=true;
        usersArray.push(msg.sender);
        User storage newUser = users[msg.sender]; 
        newUser.userAddress = msg.sender;
        newUser.username = _username;
        newUser.postCount=0;
        newUser.reputation=500;
        newUser.isVerified=true;
        
        userCount++;
        emit userRedistered(msg.sender, _username);
    }
    function verify(string memory _hash) public view returns (bool, VerificationStatus) {
    for (uint i = 1; i <= postId; i++) {
        if (keccak256(abi.encodePacked(posts[i].hash)) == keccak256(abi.encodePacked(_hash))) {
            return (true, posts[i].status);
        }
    }
    return (false, VerificationStatus.Normal); // Default when not found
}
    function createPost(string memory _hash,bool _hashExists,bool _isOriginal,VerificationStatus _existingStatus) public {
        require(isRegistered[msg.sender], "User need to register first");
        bool original;
        bool flagged=false;
        VerificationStatus postStatus = users[msg.sender].isVerified ? VerificationStatus.Verified : VerificationStatus.Normal;
        postId++;
        VerificationStatus prevStatus=postStatus;
        
        if(_hashExists==true){
            original=false;
            prevStatus=_existingStatus;
            if(_existingStatus==VerificationStatus.Misinformation){
                adjustReputation(msg.sender, -50);
            }
        }else{
            if(_isOriginal==true){
                original=true;
            }else{
                original=false;
                flagged=true;
            }
        }
        
        posts[postId]=post({

            author:msg.sender,
            postedAt: block.timestamp,
            hash: _hash,
            id: postId,
            timestamp: block.timestamp,
            likes: 0,
            dislikes: 0,
            isFlagged: flagged,
            isOriginal:original,
            status: prevStatus
        });
        users[msg.sender].userPosts.push(postId);
        users[msg.sender].postCount++;
        consesed[postId]=false;
        emit postCreated(postId, msg.sender, _hash);
    }

    function adjustReputation(address _user, int adjust) public{
        users[_user].reputation += adjust;
        if(users[_user].reputation >= MIN_REPUTATION){
            users[_user].isVerified = true;
        }else{
            users[_user].isVerified = false;
        }
    }

    function getPost(uint _postId) public view postExists(_postId) returns (address, uint, string memory, uint) {
        post memory p = posts[_postId];
        return (p.author, p.postedAt, p.hash, p.id);
    }
    function getUser(address _user) public view returns (address,string memory,uint,int,bool) {
    User storage u = users[_user];
    return (u.userAddress,u.username,u.postCount,u.reputation,u.isVerified);
}

// 
function getAllPosts() public view returns (post[] memory) {
    post[] memory allPosts = new post[](postId);

    for (uint i = 1; i <= postId; i++) {
        allPosts[i - 1] = posts[i];
    }

    return allPosts;
}
}
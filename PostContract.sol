// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract PostContract{
    int constant MIN_REPUTATION=500;
    uint public postId=0;
    uint public userCount=0;



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
        uint likes;
        uint dislikes;
        bool isFlagged;
        bool isVerified;
    }



    mapping (uint => bool) public consesed;
    mapping (uint=>post) public posts;
    mapping(address=>bool) isRegistered;
    mapping(address=>User) public users;

    modifier postExists(uint _postId){
        require(_postId>0 && _postId <= postId, "Post does not exist");
        _;
    }


    event userRedistered(address indexed user, string username);
    event postCreated(uint indexed postId, address indexed author, string hash);


    function register(string memory _username) public {
        require(!isRegistered[msg.sender], "User is already registered");
        User storage newUser = users[msg.sender]; 
        newUser.userAddress = msg.sender;
        newUser.username = _username;
        newUser.postCount=0;
        newUser.reputation=500;
        newUser.isVerified=true;
        isRegistered[msg.sender]=true;
        userCount++;
        emit userRedistered(msg.sender, _username);
    }

    function createPost(string memory _hash) public {
        require(isRegistered[msg.sender], "User need to register first");
        postId++;
        posts[postId]=post({

            author:msg.sender,
            postedAt: block.timestamp,
            hash: _hash,
            id: postId,
            likes: 0,
            dislikes: 0,
            isFlagged: false,
            isVerified: true
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
}
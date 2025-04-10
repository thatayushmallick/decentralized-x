// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract appcontract{
    uint public postId=0;




    struct User{
        address userAddress;
        string username;
        uint postCount;
        uint[] userPosts;
    }
    struct post{
        address author;
        uint postedAt;
        string hash;
        uint id;
    }




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
        isRegistered[msg.sender]=true;

        emit userRedistered(msg.sender, _username);
    }

    function createPost(string memory _hash) public {
        require(isRegistered[msg.sender], "User need to register first");
        postId++;
        posts[postId]=post({

            author:msg.sender,
            postedAt: block.timestamp,
            hash: _hash,
            id: postId
        });
        users[msg.sender].userPosts.push(postId);
        users[msg.sender].postCount++;

        emit postCreated(postId, msg.sender, _hash);
    }
    function getPost(uint _postId) public view postExists(_postId) returns (address, uint, string memory, uint) {
    post memory p = posts[_postId];
    return (p.author, p.postedAt, p.hash, p.id);
    }
}
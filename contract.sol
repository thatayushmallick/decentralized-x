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
    function register(string memory _username) public {
        require(!isRegistered[msg.sender], "User is already registered");
        User storage newUser = users[msg.sender]; 
        newUser.userAddress = msg.sender;
        newUser.username = _username;
        newUser.postCount=0;
        isRegistered[msg.sender]=true;
    }

    function createPost(string memory _hash) public {
        postId++;
        posts[postId]=post({

            author:msg.sender,
            postedAt: block.timestamp,
            hash: _hash,
            id: postId
        });
        users[msg.sender].userPosts.push(postId);
        users[msg.sender].postCount++;
    }
    function getUserPosts(address _user) public view returns (uint[] memory){
        return users[_user].userPosts;
    }
}
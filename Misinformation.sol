// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./PostContract.sol";

contract Misinformation is PostContract{
    uint constant MIN_VOTES_REQUIRED=1;
    enum VoteType{None,Like, Dislike}

    mapping(uint => mapping(address => VoteType)) public postVotes;
    mapping(uint => mapping(address =>bool )) public hasReported;
    mapping(uint => uint) reportCount;

    mapping(uint => mapping(address => bool )) public hasVoted;
    mapping(uint => uint) public yesVotes;
    mapping(uint => uint) public noVotes; 

    event Reported(uint indexed _postId, address indexed reporter);
    event FlaggedAsMisinformation(uint indexed _postId);
    event Voted(uint indexed postId, address indexed voter, bool isMisinformation);
    event FinalVerdict(uint indexed postId, bool isMisinformation);

    function report(uint _postId) public postExists(_postId){
        require(!hasReported[_postId][msg.sender], "You have already reported this Post");
        require(!consesed[_postId], "Consensus already declared on this post");
        hasReported[_postId][msg.sender]=true;
        reportCount[_postId]++;
        emit Reported(_postId,msg.sender);
        if(reportCount[_postId]*2 >= userCount){
            posts[_postId].isFlagged=true;
            emit FlaggedAsMisinformation(_postId);
        }

    }
    function vote(uint _postId, bool _isMisinformation) public{
        require(posts[_postId].isFlagged, "Post not flagged for voting");
        require(users[msg.sender].isVerified == true, "You are not a verified user");
        require(!hasVoted[_postId][msg.sender], "Already voted");
        require(!consesed[_postId], "Already consensus reached");

        if (_isMisinformation) {
            yesVotes[_postId]++;
        } else {
            noVotes[_postId]++;
        }

        emit Voted(_postId, msg.sender, _isMisinformation);
        hasVoted[_postId][msg.sender] = true;

        uint totalVotes = yesVotes[_postId] + noVotes[_postId];
        if (totalVotes >= MIN_VOTES_REQUIRED) {
            bool finalVerdict = yesVotes[_postId] > noVotes[_postId];
            posts[_postId].isVerified = !finalVerdict; // true if it's NOT misinformation
            consesed[_postId]=true;
            posts[_postId].isFlagged=false;
            emit FinalVerdict(_postId, finalVerdict);
        }
    }
    function LikePost(uint _postId) public postExists(_postId){
        VoteType previousVote = postVotes[_postId][msg.sender];
        address author = posts[_postId].author;

        require(previousVote != VoteType.Like, "You already liked this post");

        if (previousVote == VoteType.Dislike) {
            adjustReputation(author,2);
            posts[_postId].likes++;
            posts[_postId].dislikes--;
        } else {
            adjustReputation(author,1);
            posts[_postId].likes++;
        }
        
        postVotes[_postId][msg.sender] = VoteType.Like;
    }
    function DislikePost(uint _postId) public postExists(_postId){
        VoteType previousVote = postVotes[_postId][msg.sender];
        address author = posts[_postId].author;

        require(previousVote != VoteType.Dislike, "You already disliked this post");

        if (previousVote == VoteType.Like) {
            adjustReputation(author,-2);
            posts[_postId].dislikes++;
            posts[_postId].likes--;
        } else {
            adjustReputation(author,-1);
            posts[_postId].dislikes++;
        }
        
        postVotes[_postId][msg.sender] = VoteType.Dislike;
    }

    
    function getReportCount(uint _postId) public view postExists(_postId) returns (uint) {
        return reportCount[_postId];
    }

    function getVoteCounts(uint _postId) public view returns (uint up, uint down) {
        return (yesVotes[_postId], noVotes[_postId]);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IPodcast.sol";
import "./interfaces/ISession.sol";

contract RewardsContract is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IPodcastContract public podcastContract;
    ISessions public sessionsContract;

    // struct Podcast {
    //     string ipfsHash;
    //     address owner;
    //     uint256 amount;
    //     string image;
    //     string title;
    //     address[] supporters;
    // }

    constructor(
        address _podcastContract,
        address _sessionsContract
    ) ERC721("Verbal Rewards NFT", "RNFT") {
        podcastContract = IPodcastContract(_podcastContract);
        sessionsContract = ISessions(_sessionsContract);
    }

    function checkAndReward(address _user) external {
        // Check if the user uploaded a podcast

        IPodcastContract.Podcast[] memory allPodcasts = podcastContract
            .retrieveAllPodcasts();
        for (uint256 i = 0; i < allPodcasts.length; i++) {
            if (allPodcasts[i].owner == _user) {
                _mintNFT(_user);
                return;
            }
        }

        // Check if the user supported a podcast
        for (uint256 i = 0; i < allPodcasts.length; i++) {
            IPodcastContract.Podcast memory podcast = allPodcasts[i];
            for (uint256 j = 0; j < podcast.supporters.length; j++) {
                if (podcast.supporters[j] == _user) {
                    _mintNFT(_user);
                    return;
                }
            }
        }

        // Check if the user attended a session
        //get all userr sessions
        ISessions.Session[] memory userSessions = sessionsContract
            .addressToSessions(_user);
        if (userSessions.length == 0) {
            return;
        }
        _mintNFT(_user);
        // for (uint256 i = 0; i < sessionsContract.allSessions(0); i++) {
        //     ISessions.Session memory session = sessionsContract.allSessions(i);
        //     if (session.student == _user || session.mentor == _user) {
        //         _mintNFT(_user);
        //         return;
        //     }
        // }
    }

    function _mintNFT(address _user) internal {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(_user, tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IPodcast.sol";
import "./interfaces/ISession.sol";

contract RewardsContract is ERC721 {
    IPodcast public podcastContract;
    ISession public sessionsContract;

    constructor(
        address _podcastContract,
        address _sessionsContract
    ) ERC721("Veral Rewards NFT", "RNFT") {
        podcastContract = IPodcastContract(_podcastContract);
        sessionsContract = ISessions(_sessionsContract);
    }

    function checkAndReward(address _user) external {
        // Check if the user uploaded a podcast
        PodcastContract.Podcast[] memory allPodcasts = podcastContract
            .retrieveAllPodcasts();
        for (uint256 i = 0; i < allPodcasts.length; i++) {
            if (allPodcasts[i].owner == _user) {
                _mintNFT(_user);
                return;
            }
        }

        // Check if the user supported a podcast
        for (uint256 i = 0; i < allPodcasts.length; i++) {
            PodcastContract.Podcast memory podcast = allPodcasts[i];
            for (uint256 j = 0; j < podcast.supporters.length; j++) {
                if (podcast.supporters[j] == _user) {
                    _mintNFT(_user);
                    return;
                }
            }
        }

        // Check if the user attended a session
        for (uint256 i = 0; i < sessionsContract.allSessions(0); i++) {
            ISessions.Session memory session = sessionsContract.allSessions(i);
            if (session.student == _user || session.mentor == _user) {
                _mintNFT(_user);
                return;
            }
        }
    }

    function _mintNFT(address _user) internal {
        uint256 tokenId = totalSupply();
        _mint(_user, tokenId);
    }
}

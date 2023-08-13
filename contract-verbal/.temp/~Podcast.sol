// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/~Counters.sol";

contract PodcastContract {
    using Counters for Counters.Counter;

    Counters.Counter private _podcastID;

    struct Podcast {
        string ipfsHash;
        address owner;
        uint256 amount;
        string image;
        string title;
        address[] supporters;
    }

    Podcast[] allPodcasts;

    mapping(uint256 => Podcast) uintToPodcast;

    event PodcastUploaded(uint256 indexed id, address indexed owner, string title);

    modifier podcastExists(uint256 _id) {
        require(_id < _podcastID.current(), "Podcast ID does not exist");
        _;
    }

    modifier onlyPodcastOwner(uint256 _id) {
        require(uintToPodcast[_id].owner == msg.sender, "Only podcast owner can perform this action");
        _;
    }

    function uploadPodcast(
        string memory _ipfsHash,
        uint256 _amount,
        string memory _image,
        string memory _title
    ) external {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_amount > 0, "Amount must be greater than zero");

        uint256 id = _podcastID.current();
        Podcast storage newPodcast = uintToPodcast[id];
        newPodcast.ipfsHash = _ipfsHash;
        newPodcast.amount = _amount;
        newPodcast.image = _image;
        newPodcast.title = _title;
        newPodcast.owner = msg.sender;
        allPodcasts.push(newPodcast);
        _podcastID.increment();

        emit PodcastUploaded(id, msg.sender, _title);
    }

    function supportPodcast(uint256 _id) external payable podcastExists(_id) {
        Podcast storage podcast = uintToPodcast[_id];
        require(podcast.owner != msg.sender, "You cannot support your own podcast");
        require(msg.value == podcast.amount, "You must send the exact amount");

        payable(podcast.owner).transfer(msg.value);
        podcast.supporters.push(msg.sender);
    }

    function retrieveAllPodcasts() external view returns (Podcast[] memory) {
        return allPodcasts;
    }

    function withdrawFunds(uint256 _id) external podcastExists(_id) onlyPodcastOwner(_id) {
        Podcast storage podcast = uintToPodcast[_id];
        payable(podcast.owner).transfer(address(this).balance);
    }
}
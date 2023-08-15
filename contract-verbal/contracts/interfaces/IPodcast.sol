// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPodcastContract {
    struct Podcast {
        string ipfsHash;
        address owner;
        uint256 amount;
        string image;
        string title;
        address[] supporters;
    }

    event PodcastUploaded(
        uint256 indexed id,
        address indexed owner,
        string title
    );

    function uploadPodcast(
        string memory _ipfsHash,
        uint256 _amount,
        string memory _image,
        string memory _title
    ) external;

    function supportPodcast(uint256 _id) external payable;

    function retrieveAllPodcasts() external view returns (Podcast[] memory);

    function withdrawFunds(uint256 _id) external;
}

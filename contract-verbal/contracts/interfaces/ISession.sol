// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ISessions {
    struct Session {
        address mentor;
        address student;
        bool isAccepted;
        uint256 timeStamp;
        string meetingLink;
        uint256 paymentFee;
    }

    event SessionScheduled(
        address indexed mentor,
        address indexed student,
        uint256 fee,
        string meetingLink,
        uint256 indexed id
    );

    event SessionCancelled(uint256 indexed sessionId);
    event SessionAccepted(uint256 indexed sessionId);

    function isTimeFrameTaken(uint256 _timeStamp) external view returns (bool);

    function scheduleASession(
        address _mentor,
        uint256 _timestamp,
        string memory _meetingLink
    ) external;

    function cancelSession(uint256 _sessionId) external;

    function acceptSession(uint256 _sessionId) external;

    function allSessions(
        uint256 _index
    )
        external
        view
        returns (
            address mentor,
            address student,
            bool isAccepted,
            uint256 timeStamp,
            string memory meetingLink,
            uint256 paymentFee
        );

    function addressToSessions(
        address _address
    ) external view returns (Session[] memory);

    function uintToSession(
        uint256 _sessionId
    )
        external
        view
        returns (
            address mentor,
            address student,
            bool isAccepted,
            uint256 timeStamp,
            string memory meetingLink,
            uint256 paymentFee
        );
}

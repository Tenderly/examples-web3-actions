// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract CoinOracle {
    address private owner;
    mapping(string => uint256) private coinPrices;
    mapping(uint256 => SimpleCoinConsumer) public consumers;
    /** W3A listens to this event and then pushes the info */
    event RequestCoinPrice(string name, address consumer, uint256 reqId);

    constructor() {
        owner = msg.sender;
    }

    function requestPrice(string memory _name, uint256 _reqId) public payable {
        consumers[_reqId] = SimpleCoinConsumer(msg.sender);
        emit RequestCoinPrice(_name, msg.sender, _reqId);
    }

    function update(uint256 _reqId, uint256 priceInCents) public onlyOwner {
        consumers[_reqId].coinPrice(priceInCents, _reqId);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "owner only");
        _;
    }
}

contract SimpleCoinConsumer {
    CoinOracle private coinOracle;
    uint public nonce = 0;

    struct ConvertRequest {
        string coin;
        uint amount;
    }

    mapping(uint => ConvertRequest) public amountsToConvert;

    constructor(address _coinOracleAddress) {
        coinOracle = CoinOracle(_coinOracleAddress);
    }

    function doCleverStuff(string memory coin, uint amountInCents) public {
        //...
        nonce += 1;
        coinOracle.requestPrice(coin, nonce);
        amountsToConvert[nonce] = ConvertRequest(coin, amountInCents);
        //...
    }

    modifier onlyOracle() {
        require(msg.sender == address(coinOracle), "only the code oracle");
        _;
    }

    function coinPrice(uint _priceInCents, uint _nonce) external onlyOracle {
        ConvertRequest memory req = amountsToConvert[_nonce];
        delete amountsToConvert[_nonce];
        emit Exchange(req.coin, req.amount, req.amount * _priceInCents);
    }

    event Exchange(string coin, uint amountInCents, uint amountInCoins);
}

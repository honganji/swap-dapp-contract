// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapContract{
    address public deployerAddress;
    mapping(bytes32 => address) tokenAddressMap;

    constructor() payable{
        deployerAddress = msg.sender;
    }

    // list up token address with that of symbol
    function listUpTokenAddress(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == deployerAddress, "This function is not public");
        tokenAddressMap[symbol] = tokenAddress;
    }

    // show token address(for test)
    function returnTokenAddress(bytes32 symbol) public view returns (address tokenAddress){
        tokenAddress = tokenAddressMap[symbol];
    }

    // calculate value between two tokens
    function calculateValue(address tokenSendAddress, address tokenRecieveMesureAddress) public view returns (uint256 value){
        value = (1 ether) * IERC20(tokenSendAddress).balanceOf(address(this)) / ERC20(tokenRecieveMesureAddress).balanceOf(address(this));
    }

    // distribute toke to users
    function distributeToken(address tokenAddress, uint256 amount, address recipientAddress) public {
        require(msg.sender == deployerAddress, "Anyone but depoyer can distribute token!");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipientAddress, amount);
    }

    // swap tokens between two users
    function swap(address sendTokenAddress, address measureTokenAddress, address receiveTokenAddress, uint256 amount, address recipientAddress) public payable{
        IERC20 sendToken = IERC20(sendTokenAddress);
        IERC20 receiveToken = IERC20(receiveTokenAddress);

        uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 recieveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
        uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 recieveAmount = amount * recieveTokenValue / (1 ether);

        require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= recieveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");

        sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, recieveAmount);
    }
}

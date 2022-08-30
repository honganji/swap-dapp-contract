const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

describe("Swap Contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const daiToken = await ethers.getContractFactory("DaiToken");
    const ethToken = await ethers.getContractFactory("EthToken");
    const auroraToken = await ethers.getContractFactory("AuroraToken");
    const shibainuToken = await ethers.getContractFactory("ShibainuToken");
    const solanaToken = await ethers.getContractFactory("SolanaToken");
    const tetherToken = await ethers.getContractFactory("TetherToken");
    const uniswapToken = await ethers.getContractFactory("UniswapToken");
    const polygonToken = await ethers.getContractFactory("PolygonToken");
    const swapFactory = await ethers.getContractFactory("SwapContract");

    const SwapContract = await swapFactory.deploy();
    const DaiToken = await daiToken.deploy(SwapContract.address);
    const EthToken = await ethToken.deploy(SwapContract.address);
    const AoaToken = await auroraToken.deploy(SwapContract.address);
    const ShibToken = await shibainuToken.deploy(SwapContract.address);
    const SolToken = await solanaToken.deploy(SwapContract.address);
    const UsdtToken = await tetherToken.deploy(SwapContract.address);
    const UniToken = await uniswapToken.deploy(SwapContract.address);
    const MaticToken = await polygonToken.deploy(SwapContract.address);

    return {
      owner,
      addr1,
      DaiToken,
      EthToken,
      AoaToken,
      ShibToken,
      SolToken,
      UsdtToken,
      UniToken,
      MaticToken,
      SwapContract,
    };
  }
  describe("Deployment", function () {
    // check if the owner of DAI token is smart contract
    it("ERC20 token is minted from smart contract", async function () {
      const { DaiToken, SwapContract } = await loadFixture(deployTokenFixture);
      const balanceOfDai = await DaiToken.balanceOf(SwapContract.address);
      console.log(balanceOfDai.toString());
    });

    // get the value between DAI and ETH
    it("Get value between DAI and ETH", async function () {
      const { DaiToken, EthToken, SwapContract } = await loadFixture(
        deployTokenFixture
      );
      const value = await SwapContract.calculateValue(
        EthToken.address,
        DaiToken.address
      );
      console.log(
        `value of ETH/DAI is ${
          value / parseInt(ethers.utils.parseEther("1").toString())
        }`
      );
    });

    // check list up function token symbol => token address
    it("List up token address with that of symbol", async function () {
      const {
        DaiToken,
        EthToken,
        AoaToken,
        ShibToken,
        SolToken,
        UsdtToken,
        UniToken,
        MaticToken,
        SwapContract,
      } = await loadFixture(deployTokenFixture);
      const DAI = ethers.utils.formatBytes32String("DAI");
      const ETH = ethers.utils.formatBytes32String("ETH");
      const AOA = ethers.utils.formatBytes32String("AOA");
      const SHIB = ethers.utils.formatBytes32String("SHIB");
      const SOL = ethers.utils.formatBytes32String("SOL");
      const USDT = ethers.utils.formatBytes32String("USDT");
      const UNI = ethers.utils.formatBytes32String("UNI");
      const MATIC = ethers.utils.formatBytes32String("MATIC");

      const tokenSymbolList = [DAI, ETH, AOA, SHIB, SOL, USDT, UNI, MATIC];
      const tokenAddressList = [
        DaiToken.address,
        EthToken.address,
        AoaToken.address,
        ShibToken.address,
        SolToken.address,
        UsdtToken.address,
        UniToken.address,
        MaticToken.address,
      ];

      for (let i = 0; i < tokenSymbolList.length; i++) {
        await SwapContract.listUpTokenAddress(
          tokenSymbolList[i],
          tokenAddressList[i]
        );
        const tokenAddress = await SwapContract.returnTokenAddress(
          tokenSymbolList[i]
        );
        const tokenSymbol = ethers.utils.parseBytes32String(tokenSymbolList[i]);
        console.log(`${tokenSymbol} token address :${tokenAddress}`);
      }
    });

    // check swap function works
    it("swap function", async function () {
      const { owner, addr1, DaiToken, EthToken, UniToken, SwapContract } =
        await loadFixture(deployTokenFixture);

      await DaiToken.approve(
        SwapContract.address,
        ethers.utils.parseEther("200")
      );
      await SwapContract.distributeToken(
        DaiToken.address,
        ethers.utils.parseEther("100"),
        owner.address
      );
      const ethAmountBefore = await DaiToken.balanceOf(addr1.address);
      console.log(
        `Before transfer, address_1 has ${ethAmountBefore.toString()} ETH`
      );

      await SwapContract.swap(
        DaiToken.address,
        UniToken.address,
        EthToken.address,
        ethers.utils.parseEther("1"),
        addr1.address
      );

      const ethAmountAfter = ethers.utils.formatEther(
        await EthToken.balanceOf(addr1.address)
      );
      console.log(`After transfer, address_1 has ${ethAmountAfter} ETH`);
    });
  });
});

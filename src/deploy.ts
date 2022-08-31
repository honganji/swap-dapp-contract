require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(
    process.env.AURORA_PRIVATE_KEY,
    provider
  );

  console.log("Deploying contracts with the account:", deployerWallet.address);

  console.log(
    "Account balance:",
    (await deployerWallet.getBalance()).toString()
  );

  const swapFactory = await hre.ethers.getContractFactory("SwapContract");
  const daiToken = await hre.ethers.getContractFactory("DaiToken");
  const ethToken = await hre.ethers.getContractFactory("EthToken");
  const aoaToken = await hre.ethers.getContractFactory("AuroraToken");
  const shibToken = await hre.ethers.getContractFactory("ShibainuToken");
  const solToken = await hre.ethers.getContractFactory("SolanaToken");
  const usdtToken = await hre.ethers.getContractFactory("TetherToken");
  const uniToken = await hre.ethers.getContractFactory("UniswapToken");
  const maticToken = await hre.ethers.getContractFactory("PolygonToken");

  const options = { gasLimit: 1000000 };

  const SwapContract = await swapFactory
    .connect(deployerWallet)
    .deploy(options);
  await SwapContract.deployed();

  const DaiToken = await daiToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const EthToken = await ethToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const AoaToken = await aoaToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const ShibToken = await shibToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const SolToken = await solToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const UsdtToken = await usdtToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const UniToken = await uniToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  const MaticToken = await maticToken
    .connect(deployerWallet)
    .deploy(SwapContract.address, options);
  await DaiToken.deployed();
  await EthToken.deployed();
  await AoaToken.deployed();
  await ShibToken.deployed();
  await SolToken.deployed();
  await UsdtToken.deployed();
  await UniToken.deployed();
  await MaticToken.deployed();

  console.log("Swap Contract is deployed to:", SwapContract.address);
  console.log("DaiToken is deployed to:", DaiToken.address);
  console.log("EthToken is deployed to:", EthToken.address);
  console.log("AoaToken is deployed to:", AoaToken.address);
  console.log("ShibToken is deployed to:", ShibToken.address);
  console.log("SolToken is deployed to:", SolToken.address);
  console.log("UsdtToken is deployed to:", UsdtToken.address);
  console.log("UniToken is deployed to:", UniToken.address);
  console.log("MaticToken is deployed to:", MaticToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

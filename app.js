const { ethers } = require("ethers");
const ABI = require("./abi.json");

const provider = new ethers.JsonRpcProvider("https://rpc.mevblocker.io");
const USDC_ETH_POOL_ADDRESS = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";

// check if the provider is connected
async function getCurrentBlockNumber() {
    let blockNumber = await provider.getBlockNumber();
    console.log("Current block number: ", blockNumber);
}

// fetching the swap event of the USDC-ETH pool
async function fetchEvents() {
    let contract = new ethers.Contract(USDC_ETH_POOL_ADDRESS, ABI, provider);
    console.log("Listening to events...");
    console.log("Type \t \t Sender \t Recipient \t Amount USDC \t Amount ETH \t Price");
    console.log("---------------------------------------------------------------------------------------------");
    
    contract.on("Swap", (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick) => {
        
        let usdcAmount = Number(ethers.formatUnits(amount0, 6)).toFixed(4); // USDC (6 decimals)
        let ethAmount = Number(ethers.formatUnits(amount1, 18)).toFixed(4); // ETH (18 decimals)
        let price = usdcAmount / ethAmount;

        const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
        
        if (amount0 > 0) {
            console.log("Buy ETH \t", formatAddress(sender) ,"\t", formatAddress(recipient), "\t", usdcAmount, "\t", -(ethAmount), "\t$", -(price));
        } else {
            console.log("Sell ETH\t", formatAddress(sender), "\t", formatAddress(recipient), "\t", -(usdcAmount), "\t", ethAmount ,"\t$", -(price));
        }
    });
}


// getCurrentBlockNumber();
fetchEvents();
import { AxelarAssetTransfer, CHAINS, Environment, SendTokenParams } from "@axelar-network/axelarjs-sdk";
import { ethers, Wallet } from "ethers";

import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from '@chakra-ui/react';
import { useContract, useContractWrite, useWallet } from "@thirdweb-dev/react";
import { useSigner } from "@thirdweb-dev/react";

const SecretFunding = () => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount,setAmount] = useState('1000000');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedSourceChain, setSelectedSourceChain] = useState('');
  const [selectedDestinationChain, setSelectedDestinationChain] = useState('');
  const[paperId,setPaperId] = useState(0);
  const [dstchainId, setDstchainId] = useState(0);
  const { contract } = useContract("0xeC971D4C0C1c34336ACdC82235025419CAd32f27");
  const { mutateAsync: donateToPaperUsingZkBridge, isLoading } = useContractWrite(contract, "donateToPaperUsingZkBridge")

  // const signer = useSigner();
// const wallet = useWallet();
  
  const call = async () => {
    try {
      const data = await donateToPaperUsingZkBridge({ args: [paperId, dstchainId, destinationAddress, amount] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  const api = new AxelarAssetTransfer({ environment: Environment.TESTNET });


async function test() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  console.log(signer,signer,"w")

  const requestOptions: SendTokenParams = {
    fromChain: CHAINS.TESTNET.POLYGON,
    toChain: CHAINS.TESTNET.OSMOSIS,
    destinationAddress: "osmo1x3z2vepjd7fhe30epncxjrk0lehq7xdqe8ltsn",
    asset: { symbol: "aUSDC" }, // token decimal - 6
    amountInAtomicUnits: "200000",
    options: {
      evmOptions: {
        signer,
        provider,
        txOptions: null as any,
        approveSendForMe: true,
      },
    },
  };
  return api.sendToken(requestOptions);
}

const handleSubmit = async(event : any) => {
    event.preventDefault();

    // Perform any actions with the form data
    console.log({
      destinationAddress,
      amount,
      selectedAsset,
      selectedSourceChain,
      selectedDestinationChain,
    });

    test();

    // Reset form fields
    setDestinationAddress('');
    setAmount('');
    setSelectedAsset('');
    setSelectedSourceChain('');
    setSelectedDestinationChain('');
  };

  return (
    <Box p={4}>
        <h1 className='text-center p-4 text-2xl text-orange-500'>Cross-Chain Fund the DeSCI Papers Powered by Secret Network</h1>

        <Button onClick={test}>Donate To Paper</Button>
      <form onSubmit={handleSubmit}>

      <FormControl id="paperId" mb={4}>
          <FormLabel>Paper ID ?</FormLabel>
          <Input
            value={paperId}
            onChange={(e) => setPaperId(Number(e.target.value))}
            type="number"
            required
          />
        </FormControl>

        <FormControl id="destinationAddress" mb={4}>
          <FormLabel>Destination Address</FormLabel>
          <Input
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            type="text"
            required
          />
        </FormControl>

        <FormControl id="amount" mb={4}>
          <FormLabel>Amount</FormLabel>
          <Input
            value={amount}
            onChange={(e) => setAmount((parseInt(e.target.value) * 10 ** 6).toString())}
            type="text"
            required
          />
        </FormControl>

        <FormControl id="selectedAsset" mb={4}>
          <FormLabel>Select Asset</FormLabel>
          <Select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            required
          >
            <option value="">Select an asset</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
            <option value="USDT">USDT</option>
            <option value="BTCB">BTCB</option>
            <option value="FDUSD">FDUSD</option>
          </Select>
        </FormControl>

        <FormControl id="selectedSourceChain" mb={4}>
          <FormLabel>Select Source Chain</FormLabel>
          <Select
            value={selectedSourceChain}
            onChange={(e) => setSelectedSourceChain(e.target.value)}
            required
          >
            <option value="">Select a source chain</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Polygon">Polygon</option>
            <option value="Avalanche">OPBNB</option>
            <option value="BNB">BNB</option>
          </Select>
        </FormControl>

        <FormControl id="selectedDestinationChain" mb={4}>
          <FormLabel>Select Destination Chain</FormLabel>
          <Select
            value={selectedDestinationChain}
            onChange={(e) => setSelectedDestinationChain(e.target.value)}
            required
          >
            <option value="">Select a destination chain</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Polygon">Polygon</option>
            <option value="Avalanche">OPBNB</option>
            <option value="BNB">BNB</option>
          </Select>
        </FormControl>

        <FormControl id="paperId" mb={4}>
          <FormLabel>Destination ChainId</FormLabel>
          <Input
            value={dstchainId}
            onChange={(e) => setDstchainId(Number(e.target.value))}
            type="number"
            required
          />
        </FormControl>

        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default SecretFunding;


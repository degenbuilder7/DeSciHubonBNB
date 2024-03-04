// @ts-nocheck
import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage';
import axios from 'axios';
import { Box, Button, Input, Spinner, Image, Text, Link } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
// ABIs
import ABINFT from '../abis/CreatorNFT.json';

// Config

function App() {
  const toast = useToast();
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);

  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [showConfirmMintAI, setShowConfirmMintAI] = useState(false);
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // contract deployed on BSC testnet
    const nft = new ethers.Contract("0x6d1606DF729624FCA861F0A8E76b6f4740fD2539", ABINFT, provider);
    console.log(nft);
    setNFT(nft)
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsWaiting(true);

    // Call AI API to generate an image based on description
    const imageData = await createImage();

    // Upload image to IPFS (NFT.Storage)
    const url = await uploadImage(imageData);

    setMessage("Uploaded image to IPFS");
  };

  const mintainft = async (e) => {

    e.preventDefault();
        // Mint NFT
        await mintImage(url);

        setIsWaiting(false);
    
        setMessage("");
  }


  const createImage = async () => {
    setMessage("Generating Image...")

    // We can use different APIs to generate images
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

    // Send the request
    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description, options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    })

    const type = response.headers['content-type']
    const data = response.data;
    console.log(data);

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data // <-- This is so we can render it on the page
    setImage(img);
    setShowConfirmMintAI(true);
    return data
  }

  const uploadImage = async (imageData) => {
    setMessage("Uploading Image...")

    // Create instance to NFT.Storage
    const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY })

    // Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    })

    // Save the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`  
    setURL(url);

    toast({
      title: "Image Uploaded",
      description: `Your image has been uploaded to IPFS ${url}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    })
    return url
  }

  const mintImage = async (tokenURI) => {
    setMessage("Waiting for Mint...");

    const signer = await provider.getSigner();

    console.log(signer,"signer")
    // { value: ethers.utils.parseUnits("0.001", "ether") }
    const transaction = await nft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("0.0001", "ether") });
    await transaction.wait();

    
    toast({
      title: "🎉🎉",
      description: `Access NFT Minted Successfully`,
      status: "success",
      duration: 5000,
      isClosable: true,
    })
    console.log(transaction,"transaction");
  }

  useEffect(() => {
    loadBlockchainData();
  }, [])

  return (
    <>
    <h1 className='text-center text-2xl text-slate-200 my-6'>Generate an AI NFT for your Research Supporters</h1>
    <Box maxW="md" mx="auto">
      <Box className='form' p={2}>
        <form onSubmit={submitHandler} className='flex flex-col justify-center'>
          <Input
            type="text"
            placeholder="Write a name..."
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Write a little description of research .."
            onChange={(e) => setDescription(e.target.value)}
            className='my-10'
          />
          <Button mt={2} colorScheme="blue" type="submit" disabled={isWaiting}>
              Generate AI Access NFT and Upload to IPFS
          </Button>
          </form>
          <div className='flex flex-col'>
          {showConfirmMintAI && (
            <Button mt={2} colorScheme="green" onClick={mintainft}>
              Mint the Access NFT on BSC
            </Button>
          )}
          <Button mt={2} colorScheme="teal" className='' onClick={() => mintImage("https://ipfs.io/ipfs/bafyreidhebl2a6xbv73hdkjdpqnynkazer4glbymq753eqeeejcerw3yzu/metadata.json")}>
            OR Mint a Static NFT
          </Button>
          </div>

        <Box className="image" mt={4}>
          {image ? (
            <Image src={image} alt="AI generated image" />
          ) : isWaiting ? (
            <Box className="image__placeholder" textAlign="center">
              <Spinner color="blue.500" size="lg" />
              <Text mt={2}>{message}</Text>
            </Box>
          ) : null}
        </Box>
      </Box>

      {!isWaiting && url && (
        <Text mt={2}>
          View&nbsp;
          <Link href={url} isExternal>
            Metadata
          </Link>
        </Text>
      )}
    </Box>
    </>
  );
}

export default App;


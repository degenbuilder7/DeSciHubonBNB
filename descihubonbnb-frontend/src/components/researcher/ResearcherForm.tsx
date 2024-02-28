import axios from "axios";
import { useState, useContext } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { ResearcherContext } from '../../../context/ResearcherContext';
import { useForm } from 'react-hook-form';

// Paste your API Key and Secret here or load them from environment variables
const pinataApiKey = "ed78d44141b01d666d70";
const pinataApiSecret = "877694acf5575ccd442002e316965132ab7b1c5da1012d9306c885690cf13db4";
const pinataApiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const pinataHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataApiSecret,
  },
};

// Function to upload file to IPFS
async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(pinataApiUrl, formData, pinataHeaders);
    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
}

const ResearcherForm = () => {
  const { register, handleSubmit } = useForm();
  const { addResearcher } = useContext(ResearcherContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Upload file to IPFS if provided
      let ipfsUrl;
      if (data.file[0]) {
        const fileUrl = await uploadToIPFS(data.file[0]);
        ipfsUrl = fileUrl;
      }

      // Add researcher data
      const researcherData = {
        ...data,
        profileUrl: ipfsUrl || '', // Profile URL will be IPFS URL if file is uploaded, otherwise empty string
      };
      addResearcher(researcherData);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="name" mb={4}>
          <FormLabel>Name</FormLabel>
          <Input {...register('name', { required: true })} type="text" />
        </FormControl>

        <FormControl id="email" mb={4}>
          <FormLabel>Email</FormLabel>
          <Input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" />
        </FormControl>

        <FormControl id="institution" mb={4}>
          <FormLabel>Institution</FormLabel>
          <Input {...register('institution', { required: true })} type="text" />
        </FormControl>

        <FormControl id="walletAddress" mb={4}>
          <FormLabel>Wallet Address</FormLabel>
          <Input {...register('walletAddress', { required: true })} type="text" />
        </FormControl>
      
        <FormControl id="profileUrl" mb={4}>
          <FormLabel>Profile URL</FormLabel>
          <Input {...register('file')} type="file" />
        </FormControl>

        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ResearcherForm;

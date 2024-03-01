import axios from "axios";
import { useState, useContext } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { ResearcherContext } from '../../../context/ResearcherContext';
import { useForm } from 'react-hook-form';

const pinataHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
  },
};

// Function to upload data to IPFS
async function uploadToIPFS(data) {
  const formData = new FormData();
  formData.append("file", data);

  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_pinataApiUrl, formData, pinataHeaders);
    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading data to Pinata:", error);
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
      // Create JSON object from form data
      const jsonData = JSON.stringify({
        name: data.name,
        email: data.email,
        institution: data.institution,
        walletAddress: data.walletAddress,
        profileUrl: data.profileUrl || '',
      });

      // Convert JSON object to Blob
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Upload JSON Blob to IPFS
      const fileUrl = await uploadToIPFS(blob);

      // Here, you would typically update your application state or database with the IPFS URL of the uploaded data
      addResearcher({...data, profileUrl: fileUrl});
      
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <Input {...register('profileUrl')} type="text" />
        </FormControl>

        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ResearcherForm;

// @ts-nocheck
import { useEffect, useState } from 'react';
import { Box, Text, Divider, Flex } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
const ResearchersList = () => {
  const [researchers, setResearchers] = useState([]);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const res = await fetch("/api/files"); // returns the array of researchers' CIDs
        const cids = await res.json();

        const dataPromises = cids.map(async (cid) => {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid.ipfs_pin_hash}`);
          const data = await response.json();
          return data;
        });

        // Waiting for all fetch requests to complete
        const researchersData = await Promise.all(dataPromises);
        toast.success("All researchers fetched successfully");
        setResearchers(researchersData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchResearchers();
  }, []);


  console.log(researchers,"resea")
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Best Researchers
      </Text>
      <Flex flexWrap="wrap">
        {researchers.map((researcher, index) => (
          <Box
            key={index}
            w="300px"
            p={4}
            borderWidth={1}
            borderRadius="md"
            borderColor="gray.300"
            mb={4}
            mr={4}
          >
            {/* Assuming the researcher data includes a profileUrl field */}
            {researcher.profileUrl && (
              <img src={researcher.profileUrl} boxSize="300px" alt="Profile Image" objectFit="cover"  />
            )}
            <Text fontSize="lg" fontWeight="semibold">
              Name: {researcher.name}
            </Text>
            <Text>Wallet Address: {researcher.walletAddress}</Text>
            <Text>Institution: {researcher.institution}</Text>
            <Divider my={2} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ResearchersList;

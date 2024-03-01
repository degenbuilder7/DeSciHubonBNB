// @ts-nocheck
import {  useEffect } from 'react';
import { Box, Text, Divider, Flex } from '@chakra-ui/react';

const ResearchersList = () => {
  
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

  const [researchers, setResearchers] = useState([]);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const response = await pinata.pinList(
          { pinataJWTKey: process.env.PINATA_JWT },
          {
            pageLimit: 1,
          }
        );
        res.json(response.rows[0]);
      } catch (e) {
        console.log(e);
        res.status(500).send("Server Error");
      }
    }

    fetchResearchers();
  }, []); 

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Researchers List
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
            <img src={researcher.profileUrl} width={300} height={300} alt="Profile Image" />
            <Text fontSize="lg" fontWeight="semibold">
              Name: {researcher.name}
            </Text>
            <Text>Wallet Address - {researcher.walletAddress}</Text>
            <Text>Institution: {researcher.institution}</Text>
            <Divider my={2} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ResearchersList;

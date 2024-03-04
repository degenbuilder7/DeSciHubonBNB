import { Box, Input, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import lighthouse from "@lighthouse-web3/sdk";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useAddress } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import { useContract, useContractRead } from "@thirdweb-dev/react";

const ResearchPaperBox = ({
  fileName,
  publicKey,
  cid,
}: {
  fileName: string;
  publicKey: string;
  cid: string;
}) => (
  <Box
    borderWidth={1}
    borderRadius="md"
    p={4}
    boxShadow="sm"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
  >
    <RiFilePaper2Line size={24} />
    <Text fontSize="lg" fontWeight="bold" mt={2} mb={1}>
      {fileName}
    </Text>
    <Text fontSize="sm" color="gray.500">
      Uploaded by: {publicKey}
    </Text>
    <Text fontSize="sm" color="gray.500">
      CID: {cid}
    </Text>
    <div className="flex justify-center items-center">
      <Link href={`https://gateway.lighthouse.storage/ipfs/${cid}`}>
        <Button mx={4} mt={4} p-4>
          View
        </Button>
      </Link>
      <Button mx={4} mt={4}>
        Make it Public
      </Button>
      <Button mx={4} mt={4}>
        Fund this Paper
      </Button>
    </div>
    {/* Add more details here if needed */}
  </Box>
);

const Allpaper = () => {
  const address = useAddress();
  const [uploads, setUploads] = useState<any>({ data: { fileList: [] } });
  const { contract } = useContract(
    "0xeC971D4C0C1c34336ACdC82235025419CAd32f27"
  );
  const [paperid, setPaperid] = useState(0);
  const { data, isLoading } = useContractRead(contract, "papers", [paperid]);
  console.log(contract, "contract");
  const [paperData, setPaperData] = useState(null);


  useEffect(() => {
    if (data) {
      // Assuming `data` is the array from the fetched paper object
      const paper = {
        title: data[0],
        author: data[1],
        cid: data[2],
        funding: data[3],
        isreproducible: data[4],
        address: data[5],
        stage: data[6],
        treasuryaddress: data[8],
        accessnftAddress: data[11]
      };
      setPaperData(paper);
    }
  }, [data]);

  return (
    <Box p={4}>
      <SimpleGrid columns={3} spacing={4}>
        <Input
          type="number"
          placeholder="Enter PaperID"
          onChange={(e) => setPaperid(Number(e.target.value))}
        />
        <Button>View Paper</Button>

        { paperData && (
          <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="md"
          bg="white"
        >
          <Text fontSize="xl" fontWeight="bold" color="gray.600" mb={2}>
            Title: {paperData.title}
          </Text>
          <Text fontSize="md" color="blue.600">Author: {paperData.author}</Text>
          <Text fontSize="sm" color="gray.600" mb={2}>
            CID: {paperData.cid}
          </Text>
          <Text
            fontSize="sm"
            color={paperData.isreproducible ? "green.500" : "red.500"}
            mb={2}
          >
            {paperData.isreproducible ? "Publicly Reproducible" : "Private"}
          </Text>
          <Text fontSize="sm" color="gray.600" mb={2}>
            Treasury Address: {paperData.treasuryaddress}
          </Text>
          <Text fontSize="sm" color="gray.600" mb={2}>
            AccessNFTAddress: {paperData.accessnftAddress}
          </Text>
          <Link
            href={`https://gateway.lighthouse.storage/ipfs/${paperData.cid}`}
            isExternal
          >
            <Button colorScheme="blue" size="sm" mt={2}>
              View Paper
            </Button>
          </Link>
        </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default Allpaper;

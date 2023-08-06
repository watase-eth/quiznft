import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { CONTRACT_ADDRESS, PRIZE_NFT_CONTRACT_ADDRESS } from "../../const/adresses";

export default async function server(
    req: NextApiRequest,
    res: NextApiResponse
){
    try {
        const { claimerAddress } = JSON.parse(req.body);

        if(!process.env.PRIVATE_KEY) {
            throw new Error("No private key found in .env file");
        };

        const sdk = ThirdwebSDK.fromPrivateKey(
            process.env.PRIVATE_KEY, 
            "optimism-goerli"
        );

        const prizeContract = await sdk.getContract(
            PRIZE_NFT_CONTRACT_ADDRESS,
            "nft-collection"
        );

        const questionContract = await sdk.getContract(
            CONTRACT_ADDRESS
        );

        const isCorrect = await questionContract.call(
            "isCorrect",
            [claimerAddress]
        );

        if(!isCorrect) {
            res.status(400).json({error: "You did not answer correctly"});
            return;
        };

        const hasClaimed = (await prizeContract.balanceOf(claimerAddress)).gt(0);
        if(hasClaimed) {
            res.status(400).json({error: "You have already claimed your prize"});
            return;
        };

        const payload = {
            to: claimerAddress
        };

        const signedPayload = await prizeContract.erc721.signature.generate(payload);

        res.status(200).json({
            signedPayload: JSON.parse(JSON.stringify(signedPayload)),
        });

    } catch (error) {
        res.status(500).json({error: `Server error ${error}`})
    }
}
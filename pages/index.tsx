import { ConnectWallet, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../const/adresses";
import Quiz from "../components/quiz";
import NftClaim from "../components/nft-claim";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract
  } = useContract(CONTRACT_ADDRESS);

  const {
    data: hasAnswered,
    isLoading: isHasAnsweredLoading
  } = useContractRead(
    contract,
    "hasAnswered",
    [address]
  );

  const {
    data: isCorrect,
    isLoading: isIsCorrectLoading
  } = useContractRead(
    contract,
    "isCorrect",
    [address]
  );

  return (
    <div className={styles.container}>
      <ConnectWallet />
      {!isHasAnsweredLoading ? (
        !hasAnswered ? (
          <>
            <h1>The Question</h1>
            <p>Answer correctly to claim the NFT.</p>
            <Quiz />
          </>
        ) : (
          !isIsCorrectLoading &&
            isCorrect ? (
              <NftClaim />
            ) : (
              <div className={styles.card}>
                <h1>Sorry!</h1>
                <p>You have answered incorrectly.</p>
              </div>
            )
        )
      ) : (
        <p>Checking quiz status.</p>
      )}
    </div>
  );
};

export default Home;

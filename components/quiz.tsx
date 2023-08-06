import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../const/adresses";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Quiz() {
    const {
        contract
    } = useContract(CONTRACT_ADDRESS);

    const {
        data: quiz,
        isLoading: isQuizLoading
    } = useContractRead(
        contract,
        "getQuiz"
    );

    const [answerIndex, setAnswerIndex] = useState<number>(0);
    return (
        <div className={styles.card}>
            {!isQuizLoading ? (
            <div>
                <h2>{quiz[0]}</h2>
                {quiz[1].map((answer: string, index: number) => (
                <div 
                    key={index}
                    className={styles.answerOption}
                    onClick={() => {
                    setAnswerIndex(index);
                    }}
                    style={{
                    borderColor: answerIndex === index ? "green" : "white"
                    }}
                >
                    <p>{answer}</p>
                </div>
                ))}
                <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "answerQuestion",
                    [answerIndex]
                )}
                >Submit Answer</Web3Button>
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
    );
};
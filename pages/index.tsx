import {
  useAddress,
  useMetamask,
  useCoinbaseWallet,
  useWalletConnect,
  useTokenBalance,
  useContract,
  useContractRead,
  getErc20,
  getErc721,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import NftPagination from "../components/nftPagination";
import INFTPaginationProps from "../interfaces/INFTPaginationProps";

import styles from "../styles/Home.module.css";
import { ethers } from "ethers";

const tokenContractAddress = "0x772fa612d2F8fC4f8174fDdA390997E5b834f30F";
const stakingContractAddress = "0x1189E58066182e0eEf30B5f8498BCDf9B71bFdAB";
const abi = [
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "_wzrdz",
        type: "address",
      },
      {
        internalType: "contract IToken",
        name: "_rewardsToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "calculateRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lastClaimedTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsToken",
    outputs: [
      {
        internalType: "contract IToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "setEndTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wzrdzRewardsPerDay",
        type: "uint256",
      },
    ],
    name: "setRewardsPerDay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "setStartTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wzrdz",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wzrdzRewardsPerDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const Home: NextPage = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithWalletConnect = useWalletConnect();

  // Contract Hooks
  const tokenContract = useContract(tokenContractAddress);
  const { contract, isLoading } = useContract(
    "0x1189E58066182e0eEf30B5f8498BCDf9B71bFdAB",
    abi
  );

  // Load Balance of Token
  const { data: tokenBalance } = useTokenBalance(
    tokenContract.contract,
    address
  );

  ///////////////////////////////////////////////////////////////////////////
  // Custom contract functions
  ///////////////////////////////////////////////////////////////////////////
  const [claimableRewards, setClaimableRewards] = useState<any>("0");
  const [wzrdzCount, setWzrdzCount] = useState<number>(0);
  const [wzrdzNfts, setWzrdzNfts] = useState<string[]>([]);
  const [nftPagination, setNftPagination] = useState<number>(24);

  const [nftPaginationData, setNftPaginationData] =
    useState<INFTPaginationProps>({
      active: 0,
      pageSize: 0,
      total: 0,
      totalFetched: 0,
      nextCursor: null,
    });

  async function availableRewards() {
    const cr = await contract?.call("calculateRewards", [address]);
    setClaimableRewards(Number(ethers.utils.formatEther(cr)).toFixed(3));
  }

  useEffect(() => {
    if (address && contract) {
      availableRewards();
    }
  }, [address, contract]);

  async function claimRewards() {
    try {
      const claim = await contract?.call("claimRewards", [address]);
      await claim?.wait();
    } catch (e) {
      console.log(e, "claimRewards");
    }
  }

  async function getWZRDSData() {
    try {
      const options = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
        params: {
          chain: "eth",
          format: "decimal",
          token_addresses: "0xeb6e4bf8579743cFa95dFf8584Cf1b432cE9a43c",
          limit: 50,
          disable_total: false,
          cursor: nftPaginationData.nextCursor,
        },

        headers: {
          accept: "application/json",
          "X-API-Key":
            "Q4zKEBeWXo97V8JG45sXlmwoQmSv4nCoKPm9pbAR3qCjGnZK7mqYnb51SyYoqCh4",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          for (let i = 0; i < response.data.result.length; i++) {
            if (response.data.result[i]) {
              if (
                response.data.result[i].metadata == null ||
                response.data.result[i].metadata ==
                  '{"name":"Meet your wzrdz soon!","description":"Reveal upon sellout!","image":"ipfs://QmTGhLhxrUA2BTjQrbhfWN1oD5L8ZDeqyoRqU21GeTAMAo/0.png"}'
              ) {
                const options = {
                  method: "GET",
                  url: `https://deep-index.moralis.io/api/v2/nft/0xeb6e4bf8579743cFa95dFf8584Cf1b432cE9a43c/${response.data.result[i].token_id}/metadata/resync?chain=eth&flag=uri&mode=sync`,

                  headers: {
                    accept: "application/json",
                    "X-API-Key":
                      "Q4zKEBeWXo97V8JG45sXlmwoQmSv4nCoKPm9pbAR3qCjGnZK7mqYnb51SyYoqCh4",
                  },
                };
                axios
                  .request(options)
                  .then(function (response) {
                    console.log(response.data, "response.data");
                  })
                  .catch(function (error: any) {
                    console.error(error);
                  });
                continue;
              }
              const metadata = JSON.parse(response.data.result[i].metadata);

              wzrdzNfts.push(metadata);
              setWzrdzNfts([...wzrdzNfts]);
            }
          }
          setNftPaginationData({
            active: response.data.page,
            pageSize: response.data.page_size,
            totalFetched: response.data.result.length,
            total: response.data.total,
            nextCursor: response.data.cursor,
          });
          if (wzrdzCount == 0) {
            setWzrdzCount(response.data.total);
          }
        })
        .catch(function (error: any) {
          console.error(error);
        });
    } catch (e) {
      console.log(e, "getWZRDSData");
    }
  }

  const handleNextPageChange = async () => {
    if (wzrdzNfts.length < wzrdzCount) {
      await getWZRDSData();
    }
    setNftPagination(nftPagination + 24);
  };

  useEffect(() => {
    if (address && wzrdzNfts.length == 0) {
      getWZRDSData();
    }
  }, [address]);

  return (
    <div className={styles.container}>
      <h1 className="text-xl mt-3">Welcome Wzrd, claim your $WZRD tokens!</h1>
      <div className={styles.blueLeft}>
        <Image
          src="/left1.png"
          alt="blue left"
          layout="responsive"
          width={600}
          height={900}
          quality={100}
        />
      </div>
      <div className={styles.yellowRight}>
        <Image
          src="/right1.png"
          alt="yellow right"
          layout="responsive"
          width={600}
          height={900}
          quality={100}
        />
      </div>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      {!address ? (
        <div>
          <button
            className={styles.mainButton}
            onClick={connectWithMetamask as any}
          >
            {" "}
            Meta Mask
          </button>
          <button
            className={styles.mainButton}
            onClick={connectWithCoinbaseWallet as any}
          >
            {" "}
            Coinbase Wallet
          </button>
          <button
            className={styles.mainButton}
            onClick={connectWithWalletConnect as any}
          >
            {" "}
            WalletConnect
          </button>
        </div>
      ) : (
        <>
          {isLoading || claimableRewards == "0" || !tokenBalance ? (
            <div className="mt-28">Loading . . .</div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className={styles.tokenGrid}>
                  <div className={styles.tokenItem}>
                    <h3 className={styles.tokenLabel}>
                      Claimable Rewards of WZRDZ
                    </h3>
                    <p className={styles.tokenValue}>
                      <b className={styles.valueFont}>{claimableRewards}</b> $
                      {tokenBalance?.name}
                    </p>
                  </div>
                  <div className={styles.tokenItem}>
                    <h3 className={styles.tokenLabel}>Current Balance</h3>
                    <p className={styles.tokenValue}>
                      <b className={styles.valueFont}>
                        {Number(tokenBalance?.displayValue).toFixed(3)}
                      </b>{" "}
                      ${tokenBalance?.name}
                    </p>
                  </div>
                </div>
                <button
                  className={`${styles.mainButton} ${styles.spacerTop}`}
                  onClick={() => claimRewards()}
                >
                  Claim $WZRD
                </button>
              </div>

              <hr className={`${styles.divider} ${styles.spacerTop}`} />

              <h2 className={styles.titleSelected}>Your wzrdz Collection</h2>
              {wzrdzNfts.length > 0 && (
                <p className="mb-1">
                  your {wzrdzCount} wzrdz are earning you {wzrdzCount * 10}{" "}
                  $WZRD per day.({wzrdzCount} x 10 $WZRD)
                </p>
              )}

              {wzrdzNfts.length === 0 && (
                <p className="mb-2">You don't have any WZRDZ</p>
              )}

              <div className={styles.nftBoxGrid}>
                {wzrdzNfts.slice(0, nftPagination)?.map((toy: any) => (
                  <div className={styles.nftBox} key={toy.name}>
                    <img
                      className={styles.nftMedia}
                      src={toy.image.replace("ipfs:/", "https://ipfs.io/ipfs")}
                    />
                    <h3 className={styles.tokenName}>{toy.name}</h3>
                    <p className={styles.tokenValue}></p>
                  </div>
                ))}
              </div>
              {wzrdzNfts.length > 0 && (
                <NftPagination
                  nftPagination={nftPagination}
                  setNftPagination={setNftPagination}
                  allNfts={wzrdzNfts}
                  total={wzrdzCount}
                  handleNextPageChange={handleNextPageChange}
                />
              )}

              <hr className={`${styles.divider} ${styles.spacerTop}`} />
              <h1 className={styles.h1}>Built by qdibs.eth</h1>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

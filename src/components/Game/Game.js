import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { ethers } from "ethers";
import { EvmChain } from "@moralisweb3/evm-utils";
import Moralis from "moralis";
import NFTContext from "../NFTContext";
import NFTPanel from "./NFTPanel";
import NFTDetail from "./NFTDetail";
import { PageName } from "../../App";
import "./Game.css";

export default function Game(props) {
  const [metadata, setMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currMetadata, setCurrMetadata] = useState({});
  const [showNftPanel, setShowNftPanel] = useState(false);
  const [showNftPanelAnim, setShowNftPanelAnim] = useState("open");
  const [playing, setPlaying] = useState(false);
  const [nftDetail, setNftDetail] = useState(null);
  const [guideMsg, setGuideMsg] = useState(null);
  const [rotated, setRotated] = useState(false);
  const isMoblie = useMediaQuery({ query: "(max-width: 599px)" });

  //! web3 API in NFTContext
  const {
    provider,
    library,
    account,
    contractAddressRpg404,
    contractAbiRpg404,
    contractAddressStrxngers,
    // contractAbiStrxngers,
    parseEtherError,
    checkAndSwitchNetwork,
    isTestnet,
    updateStatus,
    setCurrPage,
  } = useContext(NFTContext);

  //! load NFTs
  const loadNft = async () => {
    //* check network
    await checkAndSwitchNetwork(isTestnet, updateStatus);

    // clean metadata
    setCurrMetadata({});

    if (!isLoading && !playing) {
      await loadNftStrxngers();
      await loadNftRpg404();
    }
  };

  //! check NFT holders: Strxngers
  const loadNftStrxngers = async () => {
    try {
      updateStatus(contractAddressStrxngers);
      if (!contractAddressStrxngers || contractAddressStrxngers === "") {
        updateStatus("Strxngers contract is not available");
        return;
      }

      const chain = EvmChain.ETHEREUM;

      await Moralis.start({
        apiKey: process.env.REACT_APP_MORALIS_API_KEY,
      });

      const resNft = await Moralis.EvmApi.nft.getWalletNFTs({
        address: account,
        chain,
        format: "decimal",
        tokenAddresses: [contractAddressStrxngers],
      });

      // console.log(resNft);

      if (resNft && resNft.result && resNft.result.length > 0) {
        setIsLoading(true);

        const meta = [];
        const nfts = resNft.result;
        updateStatus("Great! Your are Strxnger!");
        updateStatus(`You have ${nfts.length} Strxnger ${nfts.length > 1 ? "NFTs" : "NFT"}. Loading metadata...`);

        for (const nft of nfts) {
          const resMeta = await Moralis.EvmApi.nft.getNFTMetadata({
            address: contractAddressStrxngers,
            chain,
            format: "decimal",
            tokenId: nft._data.tokenId,
          });
          const tokenMetadata = resMeta.result._data.metadata;

          tokenMetadata.nft_type = "Strxngers";
          tokenMetadata.dna = "strxngers-" + Math.floor(Math.random() * 9999999);
          tokenMetadata.edition = tokenMetadata.name.replace("Strxngers #", "").trim();

          // console.log(tokenMetadata);
          meta.push(tokenMetadata);
          setMetadata((prevMetadata) => [...prevMetadata, tokenMetadata]);
          updateStatus(
            `You have ${nfts.length} Strxnger ${nfts.length > 1 ? "NFTs" : "NFT"}. ${meta.length} / ${
              nfts.length
            } loaded.`
          );
        }

        if (meta.length === nfts.length) {
          setIsLoading(false);
        }
      }
    } catch (err) {
      const errMsg = parseEtherError(err);
      updateStatus(errMsg);
    }
  };

  //! load NFTs: RPG 404
  const loadNftRpg404 = async () => {
    try {
      updateStatus(contractAddressRpg404);
      if (!contractAddressRpg404 || contractAddressRpg404 === "") {
        updateStatus("RPG 404 contract is not available");
        return;
      }

      const signer = library.getSigner();
      const nftContract = new ethers.Contract(contractAddressRpg404, contractAbiRpg404, signer);

      updateStatus("Loading RPG 404 NFTs from blockchain...");

      let nfts = await nftContract.walletOfOwner(account);

      const meta = [];
      if (nfts.length > 0) {
        setIsLoading(true);
        //* show selected switch nft
        updateStatus(`You have ${nfts.length} RPG404 ${nfts.length > 1 ? "NFTs" : "NFT"}. Loading metadata...`);
        for (const bg of nfts) {
          const nftIdx = bg.toNumber();
          nftContract.tokenURI(nftIdx).then((tokenMetadataURI) => {
            if (tokenMetadataURI.startsWith("ipfs://")) {
              tokenMetadataURI = `https://rpg.mypinata.cloud/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`;
            }
            // console.log(tokenMetadataURI);
            fetch(tokenMetadataURI)
              .then((response) => response.json())
              .then((tokenMetadata) => {
                tokenMetadata.nft_type = "RPG404";
                // console.log(tokenMetadata);
                meta.push(tokenMetadata);
                setMetadata((prevMetadata) => [...prevMetadata, tokenMetadata]);
                updateStatus(
                  `You have ${nfts.length} RPG404 ${nfts.length > 1 ? "NFTs" : "NFT"}. ${meta.length} / ${
                    nfts.length
                  } loaded.`
                );
                if (meta.length === nfts.length) {
                  setIsLoading(false);
                }
              })
              .catch((err) => {
                const errMsg = parseEtherError(err);
                updateStatus(errMsg);
              });
          });
        }
      } else {
        //* you don't have any RPG404 nfts, please mint or buy on opensea.io
        updateStatus(`You don't have any RPG404 NFTs. Please mint or buy on opensea.io`);
      }
    } catch (err) {
      const errMsg = parseEtherError(err);
      updateStatus(errMsg);
    }
  };

  //! check loading
  useEffect(() => {
    if (!isLoading && metadata.length > 0 && !playing) {
      // console.log(metadata.length);
      updateStatus("Select your favor NFT and play.");
    }
  }, [metadata, isLoading, updateStatus, playing]);

  //! load NFTs effect
  useEffect(() => {
    if (library) {
      loadNft();
    }
    if (provider?.on) {
      provider.on("accountsChanged", loadNft);
      return () => {
        provider?.removeListener("accountsChanged", loadNft);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, provider]);

  //! select NFT
  const selectNft = (selectedMetadata) => {
    if (selectedMetadata) {
      const newMetadata = selectedMetadata;
      setCurrMetadata({ ...newMetadata });
      updateStatus(`Selected NFT: ${newMetadata.name}`);
    }
  };

  //! show guide
  const showGuild = (msg) => {
    if (msg) {
      setGuideMsg(msg);
    }
  };

  const hideGuild = () => {
    setGuideMsg(null);
  };

  //! open NFT panel
  const openNftPanel = () => {
    if (account) {
      if (metadata.length > 0) {
        setShowNftPanelAnim("open");
        setShowNftPanel(true);
      } else {
        updateStatus("No NFT loaded");
        loadNft();
      }
    } else {
      updateStatus("Please connect wallet first");
      props.connectWallet();
    }
  };

  //! play game
  const playGame = () => {
    if (account) {
      if (metadata.length > 0) {
        if (currMetadata.name) {
          //* Play Game!!
          const elem = document.getElementById("godot-game");
          if (elem) {
            elem.contentWindow.nftMetadata = { ...currMetadata };
            window.nftMetadata = JSON.stringify(currMetadata);
            setPlaying(true);
            elem.contentWindow.startGame();
            updateStatus("Game start, enjoy!");
          } else {
            setPlaying(false);
            updateStatus("Cannot find game :-(");
          }
        } else {
          updateStatus("Please select your favor NFT before playing");
          openNftPanel();
        }
      } else {
        updateStatus("No NFT loaded");
        loadNft();
      }
    } else {
      updateStatus("Please connect wallet first");
      props.connectWallet();
    }
  };

  return (
    <div className="game">
      {(!playing || !isMoblie) && (
        <img className="game-bg" src={process.env.PUBLIC_URL + "/img/game_bg.png"} alt="Game Background" />
      )}
      <iframe
        id="godot-game"
        className={`game-iframe ${playing ? "game-iframe-show" : "game-iframe-hide"} ${
          rotated && "game-iframe-rotate"
        }`}
        title="RPG 404"
        src={process.env.PUBLIC_URL + "/game/rpg404/game.html"}
        frameBorder="0"
        scrolling="no"
        crossOrigin="anonymous"
      />
      {playing && <div className={`game-iframe-cover ${rotated && "game-iframe-cover-rotate"}`}></div>}
      {!playing && (
        <div className="game-cover">
          <img className="game-cover-img" src={process.env.PUBLIC_URL + "/img/game_cover_03.png"} alt="Game Cover" />
          {!showNftPanel && (
            <div>
              <img
                className="btn-game-play btn-clickable"
                src={process.env.PUBLIC_URL + "/img/btn_game_play.png"}
                alt="Play Game Button"
                onClick={playGame}
                onMouseOver={() => {
                  showGuild(`Press "Space", "Enter", or "Mouse Left" to jump.`);
                }}
                onMouseOut={hideGuild}
                onTouchStart={() => {
                  showGuild(`Touch panel to jump.`);
                }}
                onTouchEnd={hideGuild}
                onTouchCancel={hideGuild}
              />
              <img
                className="btn-select-nft btn-clickable"
                src={process.env.PUBLIC_URL + "/img/btn_game_select_nft.png"}
                alt="Select NFT Button"
                onClick={openNftPanel}
                onMouseOver={() => {
                  showGuild(`Select a "RPG 404" NFT as your player.`);
                }}
                onMouseOut={hideGuild}
                onTouchStart={() => {
                  showGuild(`Select a "RPG 404" NFT as your player.`);
                }}
                onTouchEnd={hideGuild}
                onTouchCancel={hideGuild}
              />
              <div className="game-guide">{guideMsg}</div>
            </div>
          )}
        </div>
      )}
      <img
        className="btn-game-to-mint"
        src={process.env.PUBLIC_URL + "/img/btn_game_to_mint.png"}
        alt="Mint Button"
        onClick={() => setCurrPage(PageName.MINT)}
      />
      <img
        className="btn-game-rotate"
        src={process.env.PUBLIC_URL + "/img/btn_game_rotate.png"}
        alt="Game Rotate Button"
        onClick={() => setRotated((state) => !state)}
      />
      {showNftPanel ? (
        <div>
          <div className={showNftPanelAnim}>
            <NFTPanel
              metadata={metadata}
              selectNft={selectNft}
              setNftDetail={setNftDetail}
              hideNftPanel={async () => {
                setShowNftPanelAnim("close");
                await new Promise((r) => setTimeout(r, 200));
                setShowNftPanel(false);
              }}
            />
          </div>
          <NFTDetail metadata={nftDetail} />
        </div>
      ) : null}
    </div>
  );
}

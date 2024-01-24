import { Auction, AuctionHouseContractFunction } from '../../wrappers/nounsAuction';
import { useEthers, useContractFunction } from '@usedapp/core';
import { connectContractToSigner } from '@usedapp/core/dist/cjs/src/hooks';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import { utils, BigNumber as EthersBN } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button, Col } from 'react-bootstrap';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { NounsAuctionHouseFactory } from '@nouns/sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import SettleManuallyBtn from '../SettleManuallyBtn';
import { Trans } from '@lingui/macro';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import WalletConnectButton from '../../components/NavWallet/WalletConnectButton';
import navDropdownClasses from '../../components/NavWallet/NavBarDropdown.module.css';
import clsx from 'clsx';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import { NavBarButtonStyle } from '../../components/NavBarButton';
import { useHistory } from 'react-router-dom';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  if (!minBidIncPercentage) {
    return new BigNumber(0);
  }
  return currentBid
    .times(minBidIncPercentage.div(100).plus(1))
    .decimalPlaces(0, BigNumber.ROUND_UP);
};

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01';
  }

  const eth = utils.formatEther(EthersBN.from(minBid.toString()));
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL);
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return new BigNumber(0);
  }
  return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
};

const Bid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  let { auction, auctionEnded } = props;
  const activeLocale = useActiveLocale();
  const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
    config.addresses.nounsAuctionHouseProxy,
  );

  const [showConnectModal, setShowConnectModal] = useState(false);









  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');

  const setModalStateHandler = (state: boolean) => {
    setShowConnectModal(state);
  };

  const history = useHistory();

  const connectWalletButtonStyle = usePickByState(
    NavBarButtonStyle.WHITE_WALLET,
    NavBarButtonStyle.COOL_WALLET,
    NavBarButtonStyle.WARM_WALLET,
    history,
  );
  

  // let placeBidContent: JSX.Element;

  // let connectModal = showConnectModal && activeAccount === undefined && (
  //   <WalletConnectModal onDismiss={() => setModalStateHandler(false)} />
  // )

  // if (activeAccount) {
  //   placeBidContent = <>
  //     <Trans>Place bid</Trans>
  //   </>
  // } else {
  //   placeBidContent = <div>
  //   {
  //     showConnectModal && activeAccount === undefined && (
  //     <WalletConnectModal onDismiss={() => setModalStateHandler(false)} />
  //     )
  //   }
  //   {activeAccount ? (<></>) : (
  //     <WalletConnectButton
  //       displayText='View Rep Tokens'
  //       className={clsx(navDropdownClasses.nounsNavLink, navDropdownClasses.connectBtn)}
  //       onClickHandler={() => setModalStateHandler(true)}
  //       buttonStyle={connectWalletButtonStyle}
  //     />
  //   )}
  // </div>;
  // }
  
  // {activeAccount ? (
  //   placeBidContent = <>
  //     <Trans>Place bid</Trans>
  //   </>
  // ) : (
  //   placeBidContent = <WalletConnectButton
  //   displayText='View Rep Tokens'
  //   className={clsx(navDropdownClasses.nounsNavLink, navDropdownClasses.connectBtn)}
  //   onClickHandler={() => setModalStateHandler(true)}
  //   buttonStyle={connectWalletButtonStyle}
  // />
  // )}

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? <Trans>Settle</Trans> : <Trans>Place bid</Trans>,
  });


  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const minBidIncPercentage = useAuctionMinBidIncPercentage();

  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const { send: placeBid, state: placeBidState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.createBid,
  );
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  );

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef).isLessThan(minBid)) {
      setModal({
        show: true,
        title: <Trans>Insufficient bid amount 🤏</Trans>,
        message: (
          <Trans>
            Please place a bid higher than or equal to the minimum bid amount of {minBidEth(minBid)}{' '}
            ETH
          </Trans>
        ),
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = utils.parseEther(bidInputRef.current.value.toString());
    const contract = connectContractToSigner(nounsAuctionHouseContract, undefined, library);
    const gasLimit = await contract.estimateGas.createBid(auction.nounId, {
      value,
    });
    placeBid(auction.nounId, {
      value,
      gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
    });
  };

  const settleAuctionHandler = () => {
    settleAuction();
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = placeBidState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      placeBidState.status = 'Success';
      setModal({
        title: <Trans>Success</Trans>,
        message: <Trans>Bid was placed successfully!</Trans>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <Trans>Place bid</Trans> });
      clearBidInput();
    }
  }, [auction, placeBidState, account, setModal]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && placeBidState.status) {
      case 'None':
        activeAccount ? setBidButtonContent({
          loading: false,
          content: <Trans>Place bid</Trans>,
        }) : setBidButtonContent({
          loading: false,
          content: <Trans>Login to Place Bid</Trans>,
        });
        
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: <></> });
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: placeBidState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Bid</Trans> });
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: placeBidState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Bid</Trans> });
        break;
    }
  }, [placeBidState, auctionEnded, activeAccount, setModal]);

  // settle auction transaction state hook
  useEffect(() => {
    switch (auctionEnded && settleAuctionState.status) {
      case 'None':
        activeAccount ? setBidButtonContent({
          loading: false,
          content: <Trans>Settle Auction</Trans>,
        }) : setBidButtonContent({
          loading: false,
          content: <Trans>Login to Settle Auction</Trans>,
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: <></> });
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Settled auction successfully!</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: settleAuctionState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: settleAuctionState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
        break;
    }
  }, [settleAuctionState, auctionEnded, setModal]);

  if (!auction) return null;

  const isDisabled =
    placeBidState.status === 'Mining' || settleAuctionState.status === 'Mining';// || !activeAccount;

  const fomoNounsBtnOnClickHandler = () => {
    // Open Fomo Nouns in a new tab
    window.open('https://fomonouns.wtf', '_blank')?.focus();
  };

  const isWalletConnected = activeAccount !== undefined;

  const loginHandler = () => {
    setShowConnectModal(true);
  }

  let placeBidAction;
  if (!activeAccount) {
    placeBidAction = loginHandler;
  } else {
    placeBidAction = auctionEnded ? settleAuctionHandler : placeBidHandler;
  }

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span className={classes.customPlaceholderBidAmt}>
              {!auctionEnded && !bidInput ? (
                <>
                  Ξ {minBidEth(minBid)}{' '}
                  <span
                    className={
                      activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.disableSmallScreens : ''
                    }
                  >
                    <Trans>or more</Trans>
                  </span>
                </>
              ) : (
                ''
              )}
            </span>
            <FormControl
              className={classes.bidInput}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          
          
          
          
          <Button
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={placeBidAction}
            // disabled={isDisabled}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </Button>











        ) : (
          <>
            <Col lg={12} className={classes.voteForNextNounBtnWrapper}>
              <Button className={classes.bidBtnAuctionEnded} onClick={activeAccount ? settleAuctionHandler : loginHandler }>
                <Trans>Settle Auction</Trans> ⌐◧-◧
              </Button>
            </Col>
            {/* Only show force settle button if wallet connected */}
            {/* {isWalletConnected && (
              <Col lg={12}>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </Col>
            )} */}
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Bid;

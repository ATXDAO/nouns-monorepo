import { useEffect, useState } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import '../src/css/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import GovernancePage from './pages/Governance';
import CreateProposalPage from './pages/CreateProposal';
import VotePage from './pages/Vote';
import RepPage from './pages/Rep';
import ExplorePage from './pages/Explore';
import NotFoundPage from './pages/NotFound';
import Playground from './pages/Playground';
import { CHAIN_ID } from './config';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AvatarProvider } from '@davatar/react';
import dayjs from 'dayjs';
import DelegatePage from './pages/DelegatePage';
import { AtxDaoNFT, useGetBalance } from './wrappers/atxDaoNFT';
import { ethers, utils } from 'ethers';

import atxDaoABI from './wrappers/atxDaoNFTAbi';
import config from './config';

const abi = new utils.Interface(atxDaoABI);

function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector(state => state.application.alertModal);

  let { balance, isLoading }  = useGetBalance(account!);

  // const { useGetBalance2 } = useGetBalance();
  // let bl = useGetBalance2(account!);


  // let balanceArr = useNFTCall2('balanceOf', [account]);
  // let balance = 0;
  // if (balanceArr !== undefined) {
  //   balance = balanceArr[0].toNumber();
  // }



  // const [balanceState, setBalanceState] = useState(0);

  // let balanceArr = useNFTCall('balanceOf', [account]);
  // let balance = 0;
  // if (balanceArr !== undefined) {
  //   balance = balanceArr[0].toNumber();
  // }

  let output;
  if (account !== null) {
    //return to > 0 after testing
    if (balance > 0) {
      output = <div>
      <Switch>
        <Route exact path="/" component={AuctionPage} />
        <Route exact path="/rep" component={RepPage} />
        <Route exact path="/vote" component={GovernancePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
      </div>
    }
  }

  return (
    <div className={`${classes.wrapper}`}>
      {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )}
      <BrowserRouter>
        <AvatarProvider
          provider={(chainId === ChainId.Mainnet ? library : undefined)}
          batchLookups={true}
        >
          <NavBar />
          { output }
        </AvatarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

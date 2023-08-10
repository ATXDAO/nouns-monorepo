import { useEffect } from 'react';
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
import { AtxDaoNFT, useNFTCall } from './wrappers/atxDaoNFT';
import { useHistory } from 'react-router';

import { Container } from 'react-bootstrap';
import logo from './assets/logo.png';
import NavWallet from './components/NavWallet';
import NavBarButton, { NavBarButtonStyle } from './components/NavBarButton';

function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector(state => state.application.alertModal);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();

  const useStateBg = true ||
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun/') ||
    history.location.pathname.includes('/auction/' || 
    history.location.pathname.includes('/rep/'));

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  let connectWalletMessageContainer;
  if (account === null) {
    connectWalletMessageContainer =
    <Container className={classes.centerScreen}>
      <div>
          <img
            style={{ width: '10rem', paddingBottom: '3rem'}}
            src={logo}
            alt="ATX DAO Logo"
          ></img>
          <h3>Portal</h3>
          <p>
          Please connect your wallet
          </p>
          <NavWallet address={account || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
      </div>
    </Container>
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

      { connectWalletMessageContainer }
      <BrowserRouter>
        <AvatarProvider
          provider={(chainId === ChainId.Mainnet ? library : undefined)}
          batchLookups={true}
        >
        <NavBar />
        <Switch>
        <Route exact path="/" component={AuctionPage} />
        <Route exact path="/rep" component={RepPage} />
        <Route exact path="/vote" component={GovernancePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
        </AvatarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

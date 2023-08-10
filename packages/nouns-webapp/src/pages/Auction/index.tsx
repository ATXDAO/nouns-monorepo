import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import NounsIntroSection from '../../components/NounsIntroSection';
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap';
import classes from './Auction.module.css';
import logo from '../../assets/logo.png';
import NavWallet from '../../components/NavWallet';
import { AtxDaoNFT, useNFTCall } from '../../wrappers/atxDaoNFT';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = onDisplayAuction?.nounId.toNumber();
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  
    let balance = 0;
    let balanceArr = useNFTCall('balanceOf', [activeAccount]);
    if (balanceArr !== undefined) {
      balance = balanceArr[0].toNumber();
    }
    
    let i;
    if (balance <= 0) {
      i = <div>
      <Container className={classes.centerScreen}>
        <div>
            <div style={{textAlign: 'center'}}>
              <img
                className={classes.centeredLogo}
                src={logo}
                alt="ATX DAO Logo"
              ></img>
            </div>
            <h4 style={{ paddingTop: '20rem'}}>
            The connected wallet does not contain an ATX DAO Membership NFT! Certain access to features will be limited.
            </h4>
        </div>
      </Container>
      <div className={classes.loaderContainer}>
          <img
            className={classes.centeredLogo}
            style={{ width: '10rem'}}
            src={logo}
            alt="ATX DAO Logo"
          ></img>
          <div className={classes.loader}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
          </div>
      </div>
    </div>;
    }
    

  return (
    <>
      { i }
      <NounsIntroSection />
      <Documentation
        backgroundColor={
          onDisplayAuctionNounId === undefined || onDisplayAuctionNounId === lastAuctionNounId
            ? backgroundColor
            : undefined
        }
      />
    </>
  );
};
export default AuctionPage;

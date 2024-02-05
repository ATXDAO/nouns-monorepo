import Auction from '../../components/Auction';
// import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
// import ProfileActivityFeed from '../../components/ProfileActivityFeed';
// import NounsIntroSection from '../../components/NounsIntroSection';
// import { useNftCall } from '../../wrappers/atxDaoNft/atxDaoNft';
// import NumberGatedComponent from '../../components/NumberGatedComponent';
// import { IS_MAINNET } from '../../config';
// import { switchNetworkToLocalhost, switchNetworkToEthereum } from '../utils/NetworkSwitcher';
import Section from '../../layout/Section';
import classes from "../../components/NounsIntroSection/NounsIntroSection.module.css"
import { Col } from 'react-bootstrap';
import DocumentationAuctionPage from '../../components/DocumentationAuctionPage';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPageNew: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = onDisplayAuction?.nounId.toNumber();
  // const activeAccount = useAppSelector(state => state.account.activeAccount);

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

  return (
    <>
      <Auction auction={onDisplayAuction} />
      <Section fullWidth={false} className={classes.videoSection}>
        <Col sm={12} lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              What is ATX DAO?
            </h1>
            <p>
            We are a City DAO (Decentralized Autonomous Organization) working to unite Austin's crypto communities, enable local artists and businesses to participate in the crypto ecosystem, and educate the government about the benefits of Web3. Established in 2021, ATX DAO has cultivated a community of 215 (and counting!) local web3 professionals and enthusiasts. On March Xth, 2024, ATX DAO launched ATX Nouns as the new means for local Austinites to join 🌮 🚀
            </p>
          </div>
        </Col>
        <Col sm={12} lg={6}>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/NUh8UGEXjJ4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"></iframe>
        </Col>
        </Section>
        <Section fullWidth={false} className={classes.videoSection}>
        <Col sm={12} lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              Join us
            </h1>
            <p>
            To become a member of ATX DAO, you must hold a membership NFT. You can mint one via the auction above or see if any are available on an NFT marketplace like OpenSea. Each ATX Noun grants an ongoing membership in ATX DAO, which comes with the following benefits:
            </p>
            <ul>
              <li>
              Access to ATX DAO events (50+/year)
              </li>
              <li>
              Access to ATX DAO’s Discord and Telegram
              </li>
              <li>
              Coveted ATX DAO Swag
              </li>
              <li>
              Ability to publish proposals to ATX DAO
              </li>
              <li>
              1 vote on all future ATX DAO proposals

              </li>
              <li>
              Eligibility to be compensated for your contributions

              </li>
              <li>
              A cute NFT that you can use as your pfp

              </li>
              <li>
              Any other benefits that the community proposes, approves, and enacts            

              </li>
            </ul>
          </div>
        </Col>
        <Col sm={12} lg={6}>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/ZvC-WN10E5o" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; "></iframe>
        </Col>
        </Section>
        <DocumentationAuctionPage
        backgroundColor={
          onDisplayAuctionNounId === undefined || onDisplayAuctionNounId === lastAuctionNounId
            ? backgroundColor
            : undefined
        }
      />
    </>
  );
};
export default AuctionPageNew;

import { Col, Row, Card } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './Governance.module.css';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Link from '../../components/Link';
import snapshotImage from '../../assets/snapshot.jpeg';
import { Container } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import { AtxDaoNFT, useNFTCall } from '../../wrappers/atxDaoNFT';
import { useAppDispatch, useAppSelector } from '../../hooks';
import membershipCheckClasses from '../../components/MembershipCheckMessage/MembershipCheckMessage.module.css';

const GovernancePage = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const forumLink = (
    <Link
      text="the forum"
      url="https://atxdao.freeflarum.com/"
      leavesPage={true}
    />
  );

  let balance = 0;
  let balanceArr = useNFTCall('balanceOf', [activeAccount]);
  if (balanceArr !== undefined) {
    balance = balanceArr[0].toNumber();
  }
  let isMember = balance > 0;
    
  if (activeAccount === undefined)
    return (<></>);
  
  return (
    <>
    { isMember 
      ?
      <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>
            <Trans>Governance</Trans>
          </span>
          <h1>
            <Trans>ATX DAO Proposals</Trans>
          </h1>
        </Row>
        <p className={classes.subheading}>
          Proposals are how we coordinate and accomplish our goals as an organization.
          All initiatives within the DAO which involve the use of treasury funds or leveraging the ATX DAO
          brand must be publicly proposed and voted on.
        </p>
        <p className={classes.subheading}>
          Any DAO member can submit a proposal. It is recommended that members use {forumLink} to
          gather feedback on their proposal before putting it to a vote.
        </p>
        <Card
        className={classes.card}
        onClick={(e) => {
          e.preventDefault();
          window.location.href='https://snapshot.org/#/atxdao.eth';
        }}  style={{ cursor: "pointer", padding: '1rem', paddingLeft: '2rem', marginBottom: '1rem'}}>
          <Row>
            <Col style={{padding: '40px'}}>
              <b>Snapshot Proposals</b>
            </Col>
            <Col style={{padding: '10px', marginRight: '3rem'}}>
              <img
              style={{ width: '5rem', float: 'right'}}
              src={snapshotImage}></img>
            </Col>
          </Row>
        </Card>
      </Col>
    </Section>
    :
    <Container className={membershipCheckClasses.centerScreen}>
        <div>
            <div style={{textAlign: 'center'}}>
              <img
                className={membershipCheckClasses.centeredLogo}
                src={logo}
                alt="ATX DAO Logo"
              ></img>
            </div>
            <h4 style={{ paddingTop: '20rem'}}>
            Certain features of the website are disabled because the connected wallet does not contain an ATX DAO Membership NFT!
            </h4>
        </div>
      </Container>
  }
  </>
  );
};
export default GovernancePage;

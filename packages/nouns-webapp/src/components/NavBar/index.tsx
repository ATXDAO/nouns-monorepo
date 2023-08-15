import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.png';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
// import testnetNoun from '../../assets/testnet-noun.png';
import config from '../../config';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
// import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
// import NavLocaleSwitcher from '../NavLocaleSwitcher';
// import NavDropdown from '../NavDropdown';
// import { Dropdown } from 'react-bootstrap';
// import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';
// import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
// import { usePickByState } from '../../utils/colorResponsiveUIUtils';
// import { ReactComponent as Noggles } from '../../assets/icons/Noggles.svg';
import { useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';
// import clsx from 'clsx';
import { IS_MAINNET, CHAIN_ID } from '../../config';
import { useEthers } from '@usedapp/core';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const treasuryBalance = useTreasuryUSDValue();
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);
  const { chainId } = useEthers();

  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // let balance = 0;
  // let balanceArr = useNFTCall('balanceOf', [activeAccount]);
  // if (balanceArr !== undefined) {
  //   balance = balanceArr[0].toNumber();
  // }

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun/') ||
    history.location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);

  let treasuryOutput;

  if (IS_MAINNET) {
    if (chainId === 1) {
      console.log("Numba 1");
        treasuryOutput = <Nav.Link
          href={daoEtherscanLink}
          className={classes.nounsNavLink}
          target="_blank"
          rel="noreferrer"
        > 
        <NavBarTreasury
          treasuryBalance={treasuryBalance.toFixed(0)}
          treasuryStyle={nonWalletButtonStyle}
        />
        </Nav.Link>
    } else {
      console.log("Numba 2");

        treasuryOutput = <NavBarTreasury
          treasuryBalance={treasuryBalance.toFixed(0)}
          treasuryStyle={nonWalletButtonStyle}
        />;
    }
  } else {
    if (CHAIN_ID === 5) {
      if (chainId === 5) {
          treasuryOutput = <Nav.Link
            href={daoEtherscanLink}
            className={classes.nounsNavLink}
            target="_blank"
            rel="noreferrer"
          > 
          <NavBarTreasury
            treasuryBalance={treasuryBalance.toFixed(0)}
            treasuryStyle={nonWalletButtonStyle}
          />
          </Nav.Link>
      } else {
        treasuryOutput = <NavBarTreasury
        treasuryBalance={treasuryBalance.toFixed(0)}
        treasuryStyle={nonWalletButtonStyle}
      />;
      }
    } else if (CHAIN_ID === 31337) {
      if (chainId === 31337) {
        treasuryOutput = <Nav.Link
        href={daoEtherscanLink}
        className={classes.nounsNavLink}
        target="_blank"
        rel="noreferrer"
        > 
        <NavBarTreasury
          treasuryBalance={treasuryBalance.toFixed(0)}
          treasuryStyle={nonWalletButtonStyle}
        />
        </Nav.Link>
      } else {
        treasuryOutput = <NavBarTreasury
        treasuryBalance={treasuryBalance.toFixed(0)}
        treasuryStyle={nonWalletButtonStyle}
      />;
      }
    }
  }





  let output;
  // console.log(balance);

  if (activeAccount !== undefined) {
    //return to > 0 after testing
    // if (balance >= 0) {
      output =
        <Navbar
          expand="xl"
          style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
          className={classes.navBarCustom}
          expanded={isNavExpanded}
        >
          <Container style={{ maxWidth: 'unset' }}>
            <div className={classes.brandAndTreasuryWrapper}>
              <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
                <img src={logo} className={classes.navBarLogo} alt="ATX DAO Logo" />
              </Navbar.Brand>
              <Nav.Item>
                { treasuryOutput }
                {/* {(
                  <Nav.Link
                    href={daoEtherscanLink}
                    className={classes.nounsNavLink}
                    target="_blank"
                    rel="noreferrer"
                  > */}
                    {/* <NavBarTreasury
                      treasuryBalance={treasuryBalance.toFixed(0)}
                      treasuryStyle={nonWalletButtonStyle}
                    /> */}
                  {/* </Nav.Link> */}
                {/* )} */}
              </Nav.Item>
            </div>
            <Navbar.Toggle
              className={classes.navBarToggle}
              aria-controls="basic-navbar-nav"
              onClick={() => setIsNavExpanded(!isNavExpanded)}
            />
            <Navbar.Collapse className="justify-content-end">
              {
                <div>
                <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
                <NavBarButton
                  buttonText={<Trans>Proposals</Trans>}
                  buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                  buttonStyle={nonWalletButtonStyle}
                />
                </Nav.Link>
                <Nav.Link
                  href={externalURL(ExternalURL.charmverse)}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeNav}
                >
                  <NavBarButton
                    buttonText={"Docs"}
                    buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <Nav.Link
                  href={externalURL(ExternalURL.discourse)}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeNav}
                >
                  <NavBarButton
                    buttonText={<Trans>Discourse</Trans>}
                    buttonIcon={<FontAwesomeIcon icon={faComments} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <Nav.Link as={Link} to="/rep" className={classes.nounsNavLink} onClick={closeNav}>
                  <NavBarButton
                    buttonText={<Trans>REP</Trans>}
                    buttonIcon={<FontAwesomeIcon icon={faCoins} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                </div>
              }
            </Navbar.Collapse>
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Container>
        </Navbar>
    // } 
    // else {
    //   output =
    //   <div>
    //   <Container className={classes.centerScreen}>
    //     <div>
    //         <div style={{textAlign: 'center'}}>
    //           <img
    //             className={classes.centeredLogo}
    //             src={logo}
    //             alt="ATX DAO Logo"
    //           ></img>
    //         </div>
    //         <h4 style={{ paddingTop: '20rem'}}>
    //         Please connect a wallet that contains an ATX DAO Membership NFT!
    //         </h4>
    //         <div className={classes.center}>
    //           <NavWallet address={activeAccount || '0'} />{' '}
    //         </div>
    //     </div>
    //   </Container>
    //   <div className={classes.loaderContainer}>
    //       <img
    //         className={classes.centeredLogo}
    //         style={{ width: '10rem'}}
    //         src={logo}
    //         alt="ATX DAO Logo"
    //       ></img>
    //       <div className={classes.loader}>
    //           <span></span>
    //           <span></span>
    //           <span></span>
    //           <span></span>
    //       </div>
    //   </div>
    //   </div>
    // }
  }
  else {
    output =
    <Container className={classes.centerScreen}>
      <div>
          <img
            style={{ width: '10rem', paddingBottom: '3rem'}}
            src={logo}
            alt="ATX DAO Logo"
          ></img>
          <h3>Member Portal</h3>
          <p>
          Please verify your membership
          </p>
          <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
      </div>
    </Container>
  }
  return (
    <>
      {output}
    </>
  );
};

export default NavBar;

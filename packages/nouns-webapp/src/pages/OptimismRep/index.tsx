import { useState } from 'react';
import classes from './RepPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useAppSelector } from '../../hooks';
import axios from 'axios';
import { useRepCall } from '../../wrappers/rep/rep';
import { useCadentCall, useCadentFunction } from '../../wrappers/cadentRepDistributor/cadentRepDistributor';
import { switchNetworkToGoerli, switchNetworkToLocalhost, switchNetworkToOPMainnet } from '../utils/NetworkSwitcher';
import { CHAIN_ID, IS_MAINNET } from '../../config';
import { useEthers } from '@usedapp/core';
import optimismImage from '../../assets/optimism.png';

const OptimismRepPage = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const [json0Name, setJson0Name] = useState();
  const [json1Name, setJson1Name] = useState('');
  const [json0Description, setJson0Description] = useState('');
  const [json1Description, setJson1Description] = useState('');
  const [json0Image, setJson0Image] = useState('');
  const [json1Image, setJson1Image] = useState('');

  const { chainId } = useEthers();

  let loadingOutput;

  if (!IS_MAINNET) {

    if (CHAIN_ID === 31337) {
      if (chainId !== 31337) {
        loadingOutput = <div>
          <h3>Please change to the proper network!</h3>
          <h6><button onClick={()=> {
            switchNetworkToLocalhost();
          }}>Switch To Localhost</button></h6>
        </div>;
      } else {
        loadingOutput = <div>
          <h3>Please be patient, the hamsters are trying their best...</h3>
        </div>;
      }
    }
    else if (CHAIN_ID === 5) {
      if (chainId !== 5) {
        loadingOutput = <div>
          <h3>Please change to the proper network!</h3>
          <h6><button style={{width:200}} onClick={()=> {
            switchNetworkToGoerli();
          }}>Switch To Goerli</button></h6>

        </div>;
      } else {
        loadingOutput = <div>
          <h3>Please be patient, the hamsters are trying their best..</h3>
        </div>;
      }
    }
  }
  else {
    if (chainId !== 10) {
      loadingOutput = <div>
        <h3>Please change to the proper network!</h3>
        <h6><button style={{width:200}} onClick={()=> {
            switchNetworkToOPMainnet();
          }}>Switch To Optimism</button></h6>
      </div>;
    } else {
      loadingOutput = <div>
        <h3>Please be patient, the hamsters are trying their best..</h3>
      </div>;
    }
  }

  const balanceOf0 = useRepCall('balanceOf', [activeAccount, 0], "0x65aD2263e658E75762253076E2EBFc9211E05D2F");
  const balanceOf1 = useRepCall('balanceOf', [activeAccount, 1], "0x65aD2263e658E75762253076E2EBFc9211E05D2F");
  const uri0 = useRepCall('uri', [0], "0x65aD2263e658E75762253076E2EBFc9211E05D2F");
  const uri1 = useRepCall('uri', [1], "0x65aD2263e658E75762253076E2EBFc9211E05D2F");

  if (uri0 !== undefined && uri1 !== undefined) {
    let finalURL0 = uri0![0].replace("ipfs://", "https://ipfs.io/ipfs/");
    let finalURL1 = uri1![0].replace("ipfs://", "https://ipfs.io/ipfs/");

    const getJsonData = async ()=> {
      let finalJson0 = await axios.get(finalURL0);
      setJson0Name(finalJson0.data.name);
      setJson0Description(finalJson0.data.description);
      setJson0Image(finalJson0.data.image);
    
      let finalJson1 = await axios.get(finalURL1);
      setJson1Name(finalJson1.data.name);
      setJson1Description(finalJson1.data.description);
      setJson1Image(finalJson1.data.image);
    }

    getJsonData();
  }

  const { send } = useCadentFunction('Claim', 'claim', [], "0x9816093CfDFeB1ADe0b88B04F89310e1d8380637");
  
  const remainingTime = useCadentCall('getRemainingTime', [activeAccount], "0x9816093CfDFeB1ADe0b88B04F89310e1d8380637");
  const amountPerCadence = useCadentCall('getAmountToDistributePerCadence', [], "0x9816093CfDFeB1ADe0b88B04F89310e1d8380637");

  let canClaimConditional;

  if (remainingTime !== undefined) {
    if (remainingTime[0] <= 0) {
    canClaimConditional = <><h6><button style={{width:200}} onClick={()=>{send()}}>Claim { amountPerCadence?.toString() } token(s)!</button></h6></>
    }else {
      canClaimConditional = <><span style={{textAlign: 'center'}}> You can redeem more tokens in less than {remainingTime?.toString() } second(s)!</span></>
    }
  }

  return (
    <Section fullWidth={false} className={classes.section}>
      <Row className={classes.headerRow}>
        
        <span>
          <Trans>Reputation</Trans>
        </span>
        <h1>
          <Trans>ATX REP</Trans>
        </h1>
      </Row>
      <Col sm={12} md={6} className={classes.wrapper}>
        <p>
          An on-chain reputation system for tracking and rewarding contributions. REP consists of an ERC1155 smart contract with two tokens on the Polygon Network. An equal amount of both tokens will be awarded to community members when distributed.
        </p>
        <Row>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>On-Chain Activity</b><br />
            </p>
            <p>
            REP will enable us to reward our most active community members and incentivize engagement with our events, initiatives and projects.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Lasting Recognition</b><br />
            </p>
            <p>
            As we further decentralize, REP will help visualize and track both the contributions that have brought us to where we are now and where the beating heart of the DAO is today.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Holistic Admission</b><br />
            </p>
            <p>
            Through REP, non-members can build concretely towards a full membership through their engagement and contributions.
            </p>
          </Col>
        </Row>
      </Col>
      <Col sm={12} md={6}>
      
        <Row>
        </Row>
        <Card className={classes.card}>
        {canClaimConditional}
          <Row>
            <h3 style={{marginBottom:'2rem', marginTop:'1rem'}}>Your REP Tokens</h3>
            {
              balanceOf1 !== undefined && json1Name !== undefined && json1Description !== undefined &&
              balanceOf0 !== undefined && json0Name !== undefined && json0Description !== undefined
              ?
              <>
              <Col sm={12} md={6}>
              { 
                balanceOf1 !== undefined && json1Name !== undefined && json1Description !== undefined
                ?
                <div>
                  <div className={classes.container}>
                  <img src={json1Image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="150px" alt="Lifetime"/>
              
                  <div className={classes.overlay}></div>
                  <h3 className={classes.centered }>
                    {Number(balanceOf1)}
                  </h3>
                  </div>
                  <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                    {json1Name}
                  </h4>
                  <p style={{textAlign: 'center'}}>
                    {json1Description}
                  </p>
                </div>
                :
                <p>Loading...</p>
              }
              </Col>
              <Col sm={12} md={6}>
                { 
                  balanceOf0 !== undefined && json0Name !== undefined && json0Description !== undefined
                  ?
                  <div>
                    <div className={classes.container}>
                    <img src={json0Image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="150px" alt="Lifetime"/>
                    <div className={classes.overlay}></div>
                    <h3 className={classes.centered }>
                      {Number(balanceOf0)}
                    </h3>
                    </div>
                    <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                      {json0Name}
                      </h4>
                    <p style={{textAlign: 'center'}}>
                      {json0Description}
                    </p>
                  </div>
                  :
                  <p>Loading...</p>
                  }
              </Col>
              </>
              :
              <div>{ loadingOutput }</div>
            }
          </Row>
            <span>Powered by 
              <a 
                href= "https://www.optimism.io/"
                target="#"
              >
                <img 
                  src={optimismImage } 
                  style={{width: '5%', height: '5%'}}
                  alt= "Optimism" />
              </a>
            </span>

            <a 
              href= "https://optimistic.etherscan.io/address/0x65ad2263e658e75762253076e2ebfc9211e05d2f"
              target="#"
            >
              OptimismScan: Reputation Tokens
            </a>
            <a 
              href= "https://optimistic.etherscan.io/address/0x9816093cfdfeb1ade0b88b04f89310e1d8380637"
              target="#"
            >
              OptimismScan: Cadent Reputation Distributor
            </a>

        </Card>
      </Col>

    </Section>
  );
};

export default OptimismRepPage;

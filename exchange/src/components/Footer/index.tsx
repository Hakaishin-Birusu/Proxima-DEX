import React from 'react'
import styled from 'styled-components'
import './Footer.css'



const FooterBody = styled.div`
    display:block;
    margin: 0px;
    width:100%;
    position: fixed;
    left: 0;
    bottom: 0;
`
const Footer: React.FC = () => {
    return (
        <FooterBody>
            {/* <FooterFrame> */}
                {/* <JRLogo>
                  <img style={{ position: 'absolute', left:10, top:25, height: 30, width:120}} src={FighterIcon} alt="Fighter" />
                </JRLogo>
                <FooterCbox>
                    <Link01 />
                     
                </FooterCbox>
                <BinanceLogo>
                    <BinanceLogoLink href="https://www.binance.org/en" target="_blank"><img style={{ height: 40, width:100, objectFit:'contain', marginBottom:'80px'}}src={BLogo} /> </BinanceLogoLink>
                </BinanceLogo> */}
            {/* </FooterFrame> */}
        </FooterBody>
    )}

export default Footer
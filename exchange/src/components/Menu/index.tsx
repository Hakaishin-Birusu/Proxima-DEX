import React, { useRef, useEffect } from 'react'
import { BookOpen, Code, PieChart, MessageCircle, Send, CheckCircle } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import useToggle from '../../hooks/useToggle'
import { useActiveWeb3React } from '../../hooks'
import { getEtherscanLink } from '../../utils'
import { useTranslation } from 'react-i18next'

import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current?.contains(e.target) ?? false) {
        return
      }
      toggle()
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, toggle])

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>
      {chainId && open && (
        <MenuFlyout>
          {/* <MenuItem id="link" href="#">
            <PieChart size={14} />
            {t('analytics')}
          </MenuItem> */}
          <MenuItem id="link" href="https://www.binance.org/en/bridge">
            <CheckCircle size={14} />
            Bridge
          </MenuItem>
          <MenuItem id="link" href="https://twitter.com/ProximaFinance">
            <Send size={14} />
            Twitter
          </MenuItem>
          <MenuItem id="link" href="https://t.me/proximafinance">
            <MessageCircle size={14} />
            Telegram
          </MenuItem>
          <MenuItem id="link" href="https://github.com/Proxima-Finance">
            <Code size={14} />
            {t('code')}
          </MenuItem>
          {/* <MenuItem id="link" href="https://medium.com/@bscswapprotocol">
            <BookOpen size={14} />
            Medium
          </MenuItem> */}
          {/* <MenuItem id="link" href="https://dappradar.com/binance-smart-chain/exchanges/bscswap">
            <CheckCircle size={14} />
            DappRadar
          </MenuItem>
          <MenuItem id="link" href="https://www.coingecko.com/en/exchanges/bscswap">
            <CheckCircle size={14} />
            CoinGecko
          </MenuItem>
          <MenuItem id="link" href="https://coinmarketcap.com/exchanges/bscswap">
            <CheckCircle size={14} />
            CoinMarketCap
          </MenuItem> */}
          {/* <MenuItem id="link" href={getEtherscanLink(chainId, '0x8BA8541453e54ce4098Db0B2919bF42C4Ebce69E', 'address')}>
            <BookOpen size={14} />
            {t('bscscancontract')}
          </MenuItem> */}
          <MenuItem id="link" href={getEtherscanLink(chainId, '0x8BA8541453e54ce4098Db0B2919bF42C4Ebce69E', 'address')}>
            <BookOpen size={14} />
            {t('bscscancontract')}
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
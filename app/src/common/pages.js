import Metamask from "../assets/metamask.png";
import Walletconnect from "../assets/walletconnect.png";
import Binance from "../assets/binance.png";

export const SideBarPages = [
    { name: "Proxima", link: "/", icon: "" },
    { name: "Proxima Exchange", link: "/exchange", icon: "" },
    { name: "Staking", link: "/staking", icon: "" },
    { name: "Farm Proxima", link: "/farmproxima", icon: "" },
    { name: "Migration", link: "/migration", icon: "" },
    { name: "MultiSend", link: "/multisend", icon: "" },
    { name: "Grant/Bounty", link: "/bounty", icon: "" },
    { name: "Airdrop", link: "/airdrop", icon: "" },
    { name: "Team Vesting", link: "/teamvesting", icon: "" },
    { name: "Governance", link: "/governance", icon: "" },
    { name: "Pair Governance", link: "/pair-governance", icon: "" },
    { name: "Proxima Metals", link: "/proxima-metals", icon: "" },
    { name: "Analytics", link: "/analytics", icon: "" },
]

export const SUPPORTED_WALLETS = {
    METAMASK: {
        connector: 'injected',
        name: 'MetaMask',
        iconName: Metamask,
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    WALLET_CONNECT: {
        connector: 'walletconnect',
        name: 'WalletConnect',
        iconName: Walletconnect,
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
    },
    BINANCE: {
        connector: 'binance',
        name: 'Binance Chain Wallet',
        iconName: Binance,
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },

}
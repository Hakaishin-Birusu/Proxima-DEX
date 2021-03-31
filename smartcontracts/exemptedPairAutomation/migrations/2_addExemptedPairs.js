const fs = require("fs");
const Factory = artifacts.require("IUniswapV2Factory");

module.exports = async function (deployer, _network, addresses) {
  const [admin, reporter, _] = addresses;
  // factory address
  const factoryAddr = "0x642E7fb78A719133f15A73E14ac5801048aD79Bc";
  const routerAddress = "0x8BA8541453e54ce4098Db0B2919bF42C4Ebce69E";
  // factory intantiation
  const factory = await Factory.at(factoryAddr);

  //mainnet tokens
  const WBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
  const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  const USDT = "0x55d398326f99059ff775485246999027b3197955";
  const BTCB = "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c";
  const ETH = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
  const DOT = "0x7083609fce4d1d8dc0c979aab8c869ea2c873402";
  const UNI = "0xbf5140a22578168fd562dccf235e5d43a02ce9b1";
  const LINK = "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd";
  const BAND = "0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18";
  const ADA = "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47";
  const SFP = "0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb";

  // create exempted pairs

  await factory.createPair(BUSD, WBNB, admin, false);
  const BUSD_WBNB = await factory.getPair(BUSD, WBNB);
  console.log("BUSD/WBNB PAIR CREATED");

  await factory.createPair(BTCB, WBNB, admin, false);
  const BTCB_WBNB = await factory.getPair(BTCB, WBNB);
  console.log("BTCB/WBNB PAIR CREATED");

  await factory.createPair(ETH, WBNB, admin, false);
  const ETH_WBNB = await factory.getPair(ETH, WBNB);
  console.log("ETH/WBNB PAIR CREATED");

  await factory.createPair(DOT, WBNB, admin, false);
  const DOT_WBNB = await factory.getPair(DOT, WBNB);
  console.log("DOT/WBNB PAIR CREATED");

  await factory.createPair(UNI, WBNB, admin, false);
  const UNI_WBNB = await factory.getPair(UNI, WBNB);
  console.log("UNI/WBNB PAIR CREATED");

  await factory.createPair(USDT, WBNB, admin, false);
  const USDT_WBNB = await factory.getPair(USDT, WBNB);
  console.log("USDT/WBNB PAIR CREATED");

  await factory.createPair(LINK, WBNB, admin, false);
  const LINK_WBNB = await factory.getPair(LINK, WBNB);
  console.log("LINK/WBNB PAIR CREATED");

  await factory.createPair(BAND, WBNB, admin, false);
  const BAND_WBNB = await factory.getPair(BAND, WBNB);
  console.log("BAND/WBNB PAIR CREATED");

  await factory.createPair(ADA, WBNB, admin, false);
  const ADA_WBNB = await factory.getPair(ADA, WBNB);
  console.log("ADA/WBNB PAIR CREATED");

  await factory.createPair(SFP, WBNB, admin, false);
  const SFP_WBNB = await factory.getPair(SFP, WBNB);
  console.log("SFP/WBNB PAIR CREATED");

  //Set router in factory
  await factory.setRouter(routerAddress);
  console.log("Router Added in factory");

  var deploymentDic = {
    BUSD_WBNB: BUSD_WBNB,
    BTCB_WBNB: BTCB_WBNB,
    LINK_WBNB: LINK_WBNB,
    USDT_WBNB: USDT_WBNB,
    UNI_WBNB: UNI_WBNB,
    DOT_WBNB: DOT_WBNB,
    ETH_WBNB: ETH_WBNB,
    SFP_WBNB: SFP_WBNB,
    ADA_WBNB: ADA_WBNB,
    BAND_WBNB: BAND_WBNB,
  };

  var deploymentDicString = JSON.stringify(deploymentDic);
  fs.writeFile(
    "MainProximaExemptedPLP.json",
    deploymentDicString,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
};

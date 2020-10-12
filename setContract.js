const ENS = artifacts.require("./ENSRegistry");
const Registrar = artifacts.require("./BaseRegistrarImplementation");
const SOCIRegistrar = artifacts.require("./SOCIRegistrarController");
const ReverseRegistrar = artifacts.require("./ReverseRegistrar");
const PublicResolver = artifacts.require("./PublicResolver");
const TestRegistra = artifacts.require("./TestRegistrar");
const SociToken = artifacts.require("./SOCIToken.sol");
const LpPools = artifacts.require("./LpPools");
const ZeroDAOCFO = artifacts.require("./ZeroDAOCFO");

const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const tld = "did";

module.exports = async function(deployer, network, accounts) {
  console.log(accounts);

  const priceArr = [ 0, 0, 0, 1e12, 1e11, 1e10, 1e9, 0 ]

  let ens = await ENS.at('0x2188bF0629A3Bd1629b2DC4a35ebaAb2f98eCe54');
  let resolver = await PublicResolver.at('0xeD47AF8284d410221ef7bdfAa3380A2cDF537dAa')
  let soci = await SociToken.at('0x50CE0914Cb392CA33aB19C0f9b03d0A5501E0B7e');
  let zeroDAOCFO = await ZeroDAOCFO.at('0xE865283432C7f37ddFd51203Cf5483635C3aC8Bf');
  let reverseRegistrar = await ReverseRegistrar.at('0x4DE7ECe30BC084b1b9222D0674900Ff14A0Ba246')
  let registrar = await Registrar.at('0x6aa43061489D06aBED38BfF4d0029FA12fe17F9d')
  let sociRegistrarAddress = '0x1295135D7d80882C42a5806183263cdd0deF1Ab8'
  let testRegistrar = await TestRegistra.at('0x5968b2557B6735a123Ce4cb55c47D71577177B95')
  let lpPoolAddress = '0x078dEB01885565fad57672dB2DF6929b68CF3267'

    /*  setupResolver */
    const resolverNode = namehash.hash("resolver");
    const resolverLabel = utils.sha3("resolver");

    console.log("setupResolver 1");
    try {
      await ens.setSubnodeOwner(
        "0x0000000000000000000000000000000000000000",
        resolverLabel,
        accounts[0]
      );
      console.log("setupResolver 2");
      await ens.setSubnodeOwner(
        "0x0000000000000000000000000000000000000000",
        utils.sha3("reverse"),
        accounts[0]
      );
      console.log("setupResolver 3");
      await ens.setSubnodeOwner(
        namehash.hash("reverse"),
        utils.sha3("addr"),
        accounts[0]
      )
      console.log("setupResolver 4");
      await ens.setSubnodeOwner(
        "0x0000000000000000000000000000000000000000",
        utils.sha3(tld),
        accounts[0]
      );
      console.log("setupResolver 5");
      await ens.setSubnodeOwner(
        namehash.hash("did"),
        utils.sha3("resolver"),
        accounts[0]
      )
      console.log("setupResolver 6");
      await ens.setResolver(namehash.hash("resolver.did"), resolver.address)
      console.log("setupResolver 7");
      await ens.setResolver(namehash.hash(tld), resolver.address)
      console.log("setupResolver 8");
      await ens.setResolver("0x0000000000000000000000000000000000000000", resolver.address)
      console.log("setupResolver 9");
      await ens.setResolver(resolverNode, resolver.address)
      console.log("setupResolver 10");
      await ens.setResolver(namehash.hash("addr.reverse"), resolver.address)
      console.log("setupResolver 11");
      await resolver.setAddr(resolverNode, resolver.address)
      console.log("setupResolver 12");
      await resolver.setAddr(namehash.hash("resolver.did"), resolver.address)

      /*  setupResolver */
      console.log("setupResolver 1");
      await ens.setSubnodeOwner('0x00000000000000000000000000000000', utils.sha3('test'), accounts[0])
      console.log("setupResolver 2");
      await ens.setResolver(namehash.hash("test"), resolver.address)
      console.log("setupResolver 3");
      console.log(testRegistrar.address);
      await ens.setSubnodeOwner('0x00000000000000000000000000000000', utils.sha3("test"), testRegistrar.address)

      /*  setupRegistrar */
      console.log("setupRegistrar 1");
      await ens.setSubnodeOwner(
        "0x0000000000000000000000000000000000000000",
        utils.sha3(tld),
        accounts[0]
      );

      /*  setController */
      console.log("setController 1");
      await resolver.setAuthorisation(namehash.hash(tld), accounts[0], true)
      console.log("setController 2");
      // set permanentRegistrar
      await resolver.setInterface(
        namehash.hash(tld),
        '0x544af80d',
        sociRegistrarAddress
      )
      console.log("setController 3");
      // set permanentRegistrarWithConfig
      await resolver.setInterface(
        namehash.hash(tld),
        '0x5d20333e',
        sociRegistrarAddress
      )
      console.log("setController 4");
      await ens.setSubnodeOwner(
        "0x0000000000000000000000000000000000000000",
        utils.sha3(tld),
        registrar.address
      );
      console.log("setController 5");
      await registrar.addController(sociRegistrarAddress)

      /*  setupReverseRegistrar */
      console.log("setupReverseRegistrar");
      await ens.setSubnodeOwner(
        namehash.hash("reverse"),
        utils.sha3("addr"),
        reverseRegistrar.address
      )

    } catch (e) {
      console.log(e);
    }

};

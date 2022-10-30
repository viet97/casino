let BuildRelease = false;
let BuildDeploy = false;
const DebugLog = true;
const DebugLogin = true;

const debugBaseUrl = 'https://apibeta.podfoods.co/';
const productionBaseUrl = 'https://api.podfoods.co/';

const debugDomain = 'https://lp.beta.podfoods.co';
const productionDomain = 'https://lp.podfoods.co';


const Config = {
  buildRelease: BuildRelease,
  buildDeploy: !BuildRelease ? false : BuildDeploy,
  debug: BuildRelease ? false : DebugLog,
  serverHost: BuildRelease && BuildDeploy ? productionBaseUrl : debugBaseUrl,
  domain: BuildRelease && BuildDeploy ? productionDomain : debugDomain,
  debugLogin: BuildRelease ? false : DebugLogin,
  useCodePush: !BuildDeploy,
};

export default Config;

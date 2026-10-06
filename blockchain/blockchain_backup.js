/* =========================================================
   AgriTrace Blockchain Bridge
   Hardhat Local + MetaMask + Ethers.js
   ========================================================= */

window.AGRITRACE = {
  NETWORK: {
    name: "Hardhat Local",
    chainId: 31337n,
    chainIdHex: "0x7a69"
  },

  CONTRACT_ADDRESS:
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",

  LOCAL_RPC_URL:
    "http://127.0.0.1:8545",

  CONTRACT_ABI: [
    "function owner() view returns (address)",

    "function isOperator(address) view returns (bool)",

    "function getRecordKey(string lotId) pure returns (bytes32)",

    "function createProduceRecord(string lotId,string cropName,string origin,uint64 harvestDate,bytes32 metadataHash) returns (bytes32)",

    "function getProduceRecord(bytes32 recordKey) view returns (tuple(string lotId,string cropName,string origin,uint64 harvestDate,uint64 createdAt,address creator,bytes32 metadataHash,bool verified,bool exists))",

    "function verifyProduceRecord(bytes32 recordKey)",

    "function recordPrice(bytes32 recordKey,uint256 farmerPrice,uint256 traderPrice,uint256 marketPrice,uint256 consumerPrice)",

    "function recordSensorReading(bytes32 recordKey,int32 temperatureCentiC,uint32 humidityBps,uint32 spoilageRiskBps)",

    "function getPriceHistory(bytes32 recordKey) view returns (tuple(uint256 farmerPrice,uint256 traderPrice,uint256 marketPrice,uint256 consumerPrice,uint64 recordedAt,address reporter)[])",

    "function getSensorHistory(bytes32 recordKey) view returns (tuple(int32 temperatureCentiC,uint32 humidityBps,uint32 spoilageRiskBps,uint64 recordedAt,address reporter)[])",

    "event ProduceRecordCreated(bytes32 indexed recordKey,string lotId,address indexed creator,bytes32 metadataHash)",

    "event ProduceRecordVerified(bytes32 indexed recordKey,address indexed verifier)",

    "event PriceRecorded(bytes32 indexed recordKey,uint256 farmerPrice,uint256 marketPrice,uint256 consumerPrice,address indexed reporter)",

    "event SensorReadingRecorded(bytes32 indexed recordKey,int32 temperatureCentiC,uint32 humidityBps,uint32 spoilageRiskBps,address indexed reporter)"
  ]
};


/* =========================================================
   ETHERS.JS CHECK
   ========================================================= */

function ensureEthers() {
  if (!window.ethers) {
    throw new Error(
      "Ethers.js failed to load. Check your internet connection or CDN access."
    );
  }
}


/* =========================================================
   READ-ONLY PROVIDER
   ========================================================= */

function getReadProvider() {
  ensureEthers();

  return new ethers.JsonRpcProvider(
    window.AGRITRACE.LOCAL_RPC_URL
  );
}


/* =========================================================
   METAMASK / BROWSER PROVIDER
   ========================================================= */

async function getBrowserProvider() {
  ensureEthers();

  if (!window.ethereum) {
    throw new Error(
      "MetaMask is not installed."
    );
  }

  return new ethers.BrowserProvider(
    window.ethereum
  );
}


/* =========================================================
   CHECK CONTRACT ADDRESS
   ========================================================= */

function isContractConfigured() {
  return (
    /^0x[a-fA-F0-9]{40}$/.test(
      window.AGRITRACE.CONTRACT_ADDRESS
    ) &&
    window.AGRITRACE.CONTRACT_ADDRESS !==
      "0x0000000000000000000000000000000000000000"
  );
}


/* =========================================================
   GET CONTRACT INSTANCE
   ========================================================= */

async function getContract({ signer = false } = {}) {
  ensureEthers();

  if (!isContractConfigured()) {
    throw new Error(
      "AgriTrace contract is not configured."
    );
  }

  let provider;
  let runner;

  if (signer) {
    provider =
      await getBrowserProvider();

    runner =
      await provider.getSigner();

  } else {
    provider =
      getReadProvider();

    runner =
      provider;
  }

  return new ethers.Contract(
    window.AGRITRACE.CONTRACT_ADDRESS,
    window.AGRITRACE.CONTRACT_ABI,
    runner
  );
}


/* =========================================================
   CHECK CONNECTED WALLET OPERATOR STATUS
   ========================================================= */

async function isConnectedOperator() {

  if (
    !window.walletState?.account ||
    !isContractConfigured()
  ) {
    return false;
  }

  try {

    const contract =
      await getContract();

    return await contract.isOperator(
      window.walletState.account
    );

  } catch (error) {

    console.error(
      "Operator check failed:",
      error
    );

    return false;
  }
}


/* =========================================================
   READ PRODUCE RECORD
   ========================================================= */

async function getReadRecord(lotId) {

  if (!lotId) {
    throw new Error(
      "Lot ID is required."
    );
  }

  const contract =
    await getContract();

  const key =
    await contract.getRecordKey(
      lotId
    );

  const record =
    await contract.getProduceRecord(
      key
    );

  return {
    key,
    record
  };
}


/* =========================================================
   CANONICAL METADATA HASH
   =========================================================
   
   This function is retained for compatibility/debugging.

   IMPORTANT:
   The CREATE flow now uses the metadata hash returned
   by the backend instead of generating another hash here.
   ========================================================= */

function canonicalMetadataHash(payload) {

  ensureEthers();

  const canonical =
    JSON.stringify({
      lotId:
        String(
          payload.lotId
        ).trim(),

      cropName:
        String(
          payload.cropName
        ).trim(),

      origin:
        String(
          payload.origin
        ).trim(),

      harvestDate:
        new Date(
          payload.harvestDate
        ).toISOString(),

      qualityGrade:
        payload.qualityGrade ||
        null
    });

  return ethers.keccak256(
    ethers.toUtf8Bytes(
      canonical
    )
  );
}


/* =========================================================
   CREATE PRODUCE RECORD ON-CHAIN
   ========================================================= */

async function createOnChainRecord(
  payload,
  onStatus
) {

  if (!payload?.lotId) {
    throw new Error(
      "Lot ID is required."
    );
  }

  if (!payload?.cropName) {
    throw new Error(
      "Crop name is required."
    );
  }

  if (!payload?.origin) {
    throw new Error(
      "Origin is required."
    );
  }

  if (!payload?.harvestDate) {
    throw new Error(
      "Harvest date is required."
    );
  }


  /* -------------------------------------------------------
     METADATA HASH MUST COME FROM BACKEND
     ------------------------------------------------------- */

  if (!payload?.metadataHash) {
    throw new Error(
      "Backend metadata hash is missing."
    );
  }


  if (
    !/^0x[a-fA-F0-9]{64}$/.test(
      payload.metadataHash
    )
  ) {
    throw new Error(
      "Backend returned an invalid metadata hash."
    );
  }


  const contract =
    await getContract({
      signer: true
    });


  /* -------------------------------------------------------
     HARVEST DATE
     ------------------------------------------------------- */

  const harvestDate =
    new Date(
      payload.harvestDate
    );


  if (
    Number.isNaN(
      harvestDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid harvest date."
    );
  }


  const harvestTimestamp =
    Math.floor(
      harvestDate.getTime() / 1000
    );


  /* -------------------------------------------------------
     USE BACKEND HASH
     ------------------------------------------------------- */

  const metadataHash =
    payload.metadataHash;


  console.log(
    "AgriTrace metadata hash:",
    metadataHash
  );


  /* -------------------------------------------------------
     METAMASK
     ------------------------------------------------------- */

  onStatus?.(
    "Waiting for MetaMask signature…"
  );


  const tx =
    await contract.createProduceRecord(
      payload.lotId,
      payload.cropName,
      payload.origin,
      harvestTimestamp,
      metadataHash
    );


  console.log(
    "Create transaction:",
    tx.hash
  );


  onStatus?.(
    `Transaction submitted: ${tx.hash}`
  );


  /* -------------------------------------------------------
     WAIT FOR BLOCKCHAIN
     ------------------------------------------------------- */

  onStatus?.(
    "Waiting for local blockchain confirmation…"
  );


  const receipt =
    await tx.wait();


  /* -------------------------------------------------------
     GET DETERMINISTIC RECORD KEY
     ------------------------------------------------------- */

  const key =
    await contract.getRecordKey(
      payload.lotId
    );


  onStatus?.(
    "Blockchain record confirmed."
  );


  return {
    txHash:
      receipt.hash,

    blockNumber:
      receipt.blockNumber,

    key,

    metadataHash
  };
}


/* =========================================================
   VERIFY PRODUCE RECORD ON-CHAIN
   ========================================================= */

async function verifyOnChainRecord(
  recordKey,
  onStatus
) {

  if (!recordKey) {
    throw new Error(
      "Blockchain record key is required."
    );
  }


  if (
    !/^0x[a-fA-F0-9]{64}$/.test(
      recordKey
    )
  ) {
    throw new Error(
      "Invalid blockchain record key."
    );
  }


  const contract =
    await getContract({
      signer: true
    });


  /* -------------------------------------------------------
     CHECK CURRENT STATUS FIRST
     ------------------------------------------------------- */

  const before =
    await contract.getProduceRecord(
      recordKey
    );


  if (!before.exists) {
    throw new Error(
      "The blockchain record does not exist."
    );
  }


  if (before.verified) {

    onStatus?.(
      "Blockchain record is already verified."
    );

    return {
      verified: true,
      alreadyVerified: true,
      txHash: null,
      record: before
    };
  }


  /* -------------------------------------------------------
     VERIFY
     ------------------------------------------------------- */

  onStatus?.(
    "Waiting for MetaMask verification signature…"
  );


  const tx =
    await contract.verifyProduceRecord(
      recordKey
    );


  console.log(
    "Verification transaction:",
    tx.hash
  );


  onStatus?.(
    `Verification submitted: ${tx.hash}`
  );


  onStatus?.(
    "Waiting for verification confirmation…"
  );


  const receipt =
    await tx.wait();


  /* -------------------------------------------------------
     READ AFTER VERIFICATION
     ------------------------------------------------------- */

  const after =
    await contract.getProduceRecord(
      recordKey
    );


  if (!after.exists) {
    throw new Error(
      "Blockchain record disappeared after verification."
    );
  }


  if (!after.verified) {
    throw new Error(
      "Verification transaction confirmed, but the record is not marked verified."
    );
  }


  onStatus?.(
    "Blockchain verification confirmed."
  );


  return {
    verified: true,
    alreadyVerified: false,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    record: after
  };
}


/* =========================================================
   LEGACY VERIFY FUNCTION
   =========================================================
   
   Kept so any existing code using verifyOnChain(lotId)
   continues to work.
   ========================================================= */

async function verifyOnChain(lotId) {

  if (!lotId) {
    throw new Error(
      "Lot ID is required."
    );
  }


  const contract =
    await getContract({
      signer: true
    });


  const key =
    await contract.getRecordKey(
      lotId
    );


  return await verifyOnChainRecord(
    key
  );
}


/* =========================================================
   RECORD PRICE HISTORY ON-CHAIN
   ========================================================= */

async function recordPriceOnChain({
  lotId,
  farmerPrice,
  traderPrice,
  marketPrice,
  consumerPrice
}) {

  if (!lotId) {
    throw new Error(
      "Lot ID is required."
    );
  }


  const contract =
    await getContract({
      signer: true
    });


  const key =
    await contract.getRecordKey(
      lotId
    );


  const scale =
    value =>
      ethers.parseUnits(
        String(value),
        2
      );


  const tx =
    await contract.recordPrice(
      key,
      scale(farmerPrice),
      scale(traderPrice),
      scale(marketPrice),
      scale(consumerPrice)
    );


  return await tx.wait();
}


/* =========================================================
   RECORD IOT SENSOR READING ON-CHAIN
   ========================================================= */

async function recordSensorOnChain({
  lotId,
  temperatureC,
  humidityPct,
  spoilageRiskPct
}) {

  if (!lotId) {
    throw new Error(
      "Lot ID is required."
    );
  }


  const contract =
    await getContract({
      signer: true
    });


  const key =
    await contract.getRecordKey(
      lotId
    );


  /* -------------------------------------------------------
     TEMPERATURE
     25.35°C → 2535
     ------------------------------------------------------- */

  const tempScaled =
    Math.round(
      Number(
        temperatureC
      ) * 100
    );


  /* -------------------------------------------------------
     HUMIDITY
     65.5% → 6550
     ------------------------------------------------------- */

  const humidityBps =
    Math.round(
      Number(
        humidityPct
      ) * 100
    );


  /* -------------------------------------------------------
     SPOILAGE RISK
     12.5% → 1250
     ------------------------------------------------------- */

  const riskBps =
    Math.round(
      Number(
        spoilageRiskPct
      ) * 100
    );


  const tx =
    await contract.recordSensorReading(
      key,
      tempScaled,
      humidityBps,
      riskBps
    );


  return await tx.wait();
}


/* =========================================================
   EXPORT BLOCKCHAIN FUNCTIONS
   ========================================================= */

window.blockchain = {

  getContract,

  getReadRecord,

  canonicalMetadataHash,

  createOnChainRecord,

  verifyOnChainRecord,

  verifyOnChain,

  recordPriceOnChain,

  recordSensorOnChain,

  isContractConfigured,

  isConnectedOperator
};
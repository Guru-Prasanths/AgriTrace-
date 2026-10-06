// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgriTrace
 * @notice Immutable registry for farm-to-market agricultural traceability.
 * @dev Intended for Ethereum-compatible testnets such as Sepolia.
 *      Large documents/sensor histories should remain off-chain; hashes/anchors
 *      are stored on-chain for independent verification.
 */
contract AgriTrace {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct ProduceRecord {
        string lotId;
        string cropName;
        string origin;
        uint64 harvestDate;
        uint64 createdAt;
        address creator;
        bytes32 metadataHash;
        bool verified;
        bool exists;
    }

    struct PriceRecord {
        uint256 farmerPrice;
        uint256 traderPrice;
        uint256 marketPrice;
        uint256 consumerPrice;
        uint64 recordedAt;
        address reporter;
    }

    struct SensorRecord {
        int32 temperatureCentiC;
        uint32 humidityBps;
        uint32 spoilageRiskBps;
        uint64 recordedAt;
        address reporter;
    }

    address public immutable owner;
    mapping(address => bool) public isOperator;
    mapping(bytes32 => ProduceRecord) private produceRecords;
    mapping(bytes32 => PriceRecord[]) private priceHistory;
    mapping(bytes32 => SensorRecord[]) private sensorHistory;
    mapping(bytes32 => bool) public recordExists;

    event OperatorUpdated(address indexed operator, bool enabled);
    event ProduceRecordCreated(bytes32 indexed recordKey, string lotId, address indexed creator, bytes32 metadataHash);
    event ProduceRecordVerified(bytes32 indexed recordKey, address indexed verifier);
    event PriceRecorded(bytes32 indexed recordKey, uint256 farmerPrice, uint256 marketPrice, uint256 consumerPrice, address indexed reporter);
    event SensorReadingRecorded(bytes32 indexed recordKey, int32 temperatureCentiC, uint32 humidityBps, uint32 spoilageRiskBps, address indexed reporter);

    modifier onlyOwner() {
        require(msg.sender == owner, "AgriTrace: not owner");
        _;
    }

    modifier onlyOperator() {
        require(isOperator[msg.sender] || msg.sender == owner, "AgriTrace: not operator");
        _;
    }

    constructor() {
        owner = msg.sender;
        isOperator[msg.sender] = true;
        emit OperatorUpdated(msg.sender, true);
    }

    function setOperator(address operator, bool enabled) external onlyOwner {
        require(operator != address(0), "AgriTrace: zero operator");
        isOperator[operator] = enabled;
        emit OperatorUpdated(operator, enabled);
    }

    /**
     * @notice Creates an immutable anchor for an agricultural lot.
     * @param lotId Human-readable lot identifier, expected to be unique in the app.
     * @param cropName Crop/produce name.
     * @param origin Farm/village/district/country origin description.
     * @param harvestDate Unix timestamp of harvest date.
     * @param metadataHash Keccak-256 hash of canonical off-chain metadata.
     */
    function createProduceRecord(
        string calldata lotId,
        string calldata cropName,
        string calldata origin,
        uint64 harvestDate,
        bytes32 metadataHash
   ) external onlyOperator returns (bytes32 recordKey) {
        require(bytes(lotId).length > 0, "AgriTrace: lot id required");
        require(bytes(cropName).length > 0, "AgriTrace: crop required");
        require(bytes(origin).length > 0, "AgriTrace: origin required");
        require(harvestDate > 0 && harvestDate <= block.timestamp, "AgriTrace: invalid harvest date");
        require(metadataHash != bytes32(0), "AgriTrace: metadata hash required");

        recordKey = keccak256(abi.encodePacked(lotId));
        require(!recordExists[recordKey], "AgriTrace: lot already exists");

        produceRecords[recordKey] = ProduceRecord({
            lotId: lotId,
            cropName: cropName,
            origin: origin,
            harvestDate: harvestDate,
            createdAt: uint64(block.timestamp),
            creator: msg.sender,
            metadataHash: metadataHash,
            verified: false,
            exists: true
        });

        recordExists[recordKey] = true;
        emit ProduceRecordCreated(recordKey, lotId, msg.sender, metadataHash);
    }

    /**
     * @notice Marks an existing record as verified by an operator.
     */
    function verifyProduceRecord(bytes32 recordKey) external onlyOperator {
        require(recordExists[recordKey], "AgriTrace: record not found");
        ProduceRecord storage record = produceRecords[recordKey];
        require(!record.verified, "AgriTrace: already verified");
        record.verified = true;
        emit ProduceRecordVerified(recordKey, msg.sender);
    }

    /**
     * @notice Adds a price snapshot in smallest currency units (e.g. paise for INR).
     *         Keeping the values as integers avoids floating-point ambiguity.
     */
    function recordPrice(
        bytes32 recordKey,
        uint256 farmerPrice,
        uint256 traderPrice,
        uint256 marketPrice,
        uint256 consumerPrice
    ) external onlyOperator {
        require(recordExists[recordKey], "AgriTrace: record not found");
        require(farmerPrice <= consumerPrice, "AgriTrace: invalid farmer price");
        require(traderPrice <= consumerPrice, "AgriTrace: invalid trader price");
        require(marketPrice <= consumerPrice, "AgriTrace: invalid market price");

        priceHistory[recordKey].push(PriceRecord({
            farmerPrice: farmerPrice,
            traderPrice: traderPrice,
            marketPrice: marketPrice,
            consumerPrice: consumerPrice,
            recordedAt: uint64(block.timestamp),
            reporter: msg.sender
        }));

        emit PriceRecorded(recordKey, farmerPrice, marketPrice, consumerPrice, msg.sender);
    }

    /**
     * @notice Anchors a sensor observation. Values are scaled integers:
     *         temperatureCentiC = degrees C * 100; humidity/spoilage are basis points.
     */
    function recordSensorReading(
        bytes32 recordKey,
        int32 temperatureCentiC,
        uint32 humidityBps,
        uint32 spoilageRiskBps
    ) external onlyOperator {
        require(recordExists[recordKey], "AgriTrace: record not found");
        require(humidityBps <= 10000, "AgriTrace: humidity out of range");
        require(spoilageRiskBps <= 10000, "AgriTrace: risk out of range");

        sensorHistory[recordKey].push(SensorRecord({
            temperatureCentiC: temperatureCentiC,
            humidityBps: humidityBps,
            spoilageRiskBps: spoilageRiskBps,
            recordedAt: uint64(block.timestamp),
            reporter: msg.sender
        }));

        emit SensorReadingRecorded(recordKey, temperatureCentiC, humidityBps, spoilageRiskBps, msg.sender);
    }

    function getProduceRecord(bytes32 recordKey) external view returns (ProduceRecord memory) {
        require(recordExists[recordKey], "AgriTrace: record not found");
        return produceRecords[recordKey];
    }

    function getPriceHistory(bytes32 recordKey) external view returns (PriceRecord[] memory) {
        require(recordExists[recordKey], "AgriTrace: record not found");
        return priceHistory[recordKey];
    }

    function getSensorHistory(bytes32 recordKey) external view returns (SensorRecord[] memory) {
        require(recordExists[recordKey], "AgriTrace: record not found");
        return sensorHistory[recordKey];
    }

    function getRecordKey(string calldata lotId) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(lotId));
    }
}

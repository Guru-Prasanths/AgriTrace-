const { expect } = require("chai");
const { ethers } = require("hardhat");

function hashMetadata(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

describe("AgriTrace Contract Suite", function () {
  async function fixture() {
    const [owner, operator, stranger, newOperator] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("AgriTrace");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();
    await contract.setOperator(operator.address, true);
    return { contract, owner, operator, stranger, newOperator };
  }

  describe("Access Control & Operators", function () {
    it("assigns deployer as owner and initial operator", async function () {
      const { contract, owner } = await fixture();
      expect(await contract.owner()).to.equal(owner.address);
      expect(await contract.isOperator(owner.address)).to.equal(true);
    });

    it("allows owner to grant and revoke operator role", async function () {
      const { contract, owner, newOperator } = await fixture();
      await expect(contract.connect(owner).setOperator(newOperator.address, true))
        .to.emit(contract, "OperatorUpdated")
        .withArgs(newOperator.address, true);
      expect(await contract.isOperator(newOperator.address)).to.equal(true);

      await expect(contract.connect(owner).setOperator(newOperator.address, false))
        .to.emit(contract, "OperatorUpdated")
        .withArgs(newOperator.address, false);
      expect(await contract.isOperator(newOperator.address)).to.equal(false);
    });

    it("prevents non-owner from managing operators", async function () {
      const { contract, stranger, newOperator } = await fixture();
      await expect(
        contract.connect(stranger).setOperator(newOperator.address, true)
      ).to.be.revertedWith("AgriTrace: not owner");
    });

    it("rejects setting zero address as operator", async function () {
      const { contract, owner } = await fixture();
      await expect(
        contract.connect(owner).setOperator(ethers.ZeroAddress, true)
      ).to.be.revertedWith("AgriTrace: zero operator");
    });
  });

  describe("Produce Record Creation & Retrieval", function () {
    it("creates and retrieves a produce record with correct fields", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      const metadataHash = hashMetadata("demo-mango-lot");

      const key = await contract.getRecordKey("AGR-2026-0001");
      await expect(
        contract.connect(operator).createProduceRecord(
          "AGR-2026-0001",
          "Mango",
          "Salem, Tamil Nadu",
          harvest,
          metadataHash
        )
      )
        .to.emit(contract, "ProduceRecordCreated")
        .withArgs(key, "AGR-2026-0001", operator.address, metadataHash);

      const record = await contract.getProduceRecord(key);
      expect(record.lotId).to.equal("AGR-2026-0001");
      expect(record.cropName).to.equal("Mango");
      expect(record.origin).to.equal("Salem, Tamil Nadu");
      expect(record.harvestDate).to.equal(harvest);
      expect(record.creator).to.equal(operator.address);
      expect(record.metadataHash).to.equal(metadataHash);
      expect(record.verified).to.equal(false);
      expect(record.exists).to.equal(true);
      expect(await contract.recordExists(key)).to.equal(true);
    });

    it("blocks unauthorized accounts from creating produce records", async function () {
      const { contract, stranger } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await expect(
        contract.connect(stranger).createProduceRecord(
          "AGR-2026-0002",
          "Tomato",
          "Hosur, Tamil Nadu",
          harvest,
          hashMetadata("demo")
        )
      ).to.be.revertedWith("AgriTrace: not operator");
    });

    it("rejects duplicate lot ID creation", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      const meta = hashMetadata("lot-dup");

      await contract.connect(operator).createProduceRecord(
        "AGR-DUP-01",
        "Rice",
        "Thanjavur, Tamil Nadu",
        harvest,
        meta
      );

      await expect(
        contract.connect(operator).createProduceRecord(
          "AGR-DUP-01",
          "Rice",
          "Thanjavur, Tamil Nadu",
          harvest,
          meta
        )
      ).to.be.revertedWith("AgriTrace: lot already exists");
    });

    it("rejects empty or invalid inputs", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      const meta = hashMetadata("valid-meta");

      // Empty lot ID
      await expect(
        contract.connect(operator).createProduceRecord("", "Wheat", "Punjab", harvest, meta)
      ).to.be.revertedWith("AgriTrace: lot id required");

      // Empty crop name
      await expect(
        contract.connect(operator).createProduceRecord("AGR-INV-1", "", "Punjab", harvest, meta)
      ).to.be.revertedWith("AgriTrace: crop required");

      // Empty origin
      await expect(
        contract.connect(operator).createProduceRecord("AGR-INV-2", "Wheat", "", harvest, meta)
      ).to.be.revertedWith("AgriTrace: origin required");

      // Future harvest date
      const futureHarvest = Math.floor(Date.now() / 1000) + 100000;
      await expect(
        contract.connect(operator).createProduceRecord("AGR-INV-3", "Wheat", "Punjab", futureHarvest, meta)
      ).to.be.revertedWith("AgriTrace: invalid harvest date");

      // Zero harvest date
      await expect(
        contract.connect(operator).createProduceRecord("AGR-INV-4", "Wheat", "Punjab", 0, meta)
      ).to.be.revertedWith("AgriTrace: invalid harvest date");

      // Zero metadata hash
      await expect(
        contract.connect(operator).createProduceRecord("AGR-INV-5", "Wheat", "Punjab", harvest, ethers.ZeroHash)
      ).to.be.revertedWith("AgriTrace: metadata hash required");
    });

    it("reverts when querying non-existent record", async function () {
      const { contract } = await fixture();
      const dummyKey = ethers.keccak256(ethers.toUtf8Bytes("NON-EXISTENT"));
      await expect(contract.getProduceRecord(dummyKey)).to.be.revertedWith("AgriTrace: record not found");
    });
  });

  describe("Record Verification Lifecycle", function () {
    it("allows operator to verify an existing record", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-VERIFY-1",
        "Banana",
        "Trichy, Tamil Nadu",
        harvest,
        hashMetadata("verify-lot")
      );
      const key = await contract.getRecordKey("AGR-VERIFY-1");

      await expect(contract.connect(operator).verifyProduceRecord(key))
        .to.emit(contract, "ProduceRecordVerified")
        .withArgs(key, operator.address);

      const record = await contract.getProduceRecord(key);
      expect(record.verified).to.equal(true);
    });

    it("prevents double verification", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-VERIFY-2",
        "Banana",
        "Trichy, Tamil Nadu",
        harvest,
        hashMetadata("verify-lot-2")
      );
      const key = await contract.getRecordKey("AGR-VERIFY-2");
      await contract.connect(operator).verifyProduceRecord(key);

      await expect(
        contract.connect(operator).verifyProduceRecord(key)
      ).to.be.revertedWith("AgriTrace: already verified");
    });

    it("prevents unauthorized verification", async function () {
      const { contract, operator, stranger } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-VERIFY-3",
        "Banana",
        "Trichy, Tamil Nadu",
        harvest,
        hashMetadata("verify-lot-3")
      );
      const key = await contract.getRecordKey("AGR-VERIFY-3");

      await expect(
        contract.connect(stranger).verifyProduceRecord(key)
      ).to.be.revertedWith("AgriTrace: not operator");
    });
  });

  describe("Price Discovery", function () {
    it("records valid price progression and emits event", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-PRICE-1",
        "Chilli",
        "Guntur, Andhra Pradesh",
        harvest,
        hashMetadata("price-demo")
      );
      const key = await contract.getRecordKey("AGR-PRICE-1");

      await expect(
        contract.connect(operator).recordPrice(key, 2800, 3400, 4100, 5200)
      )
        .to.emit(contract, "PriceRecorded")
        .withArgs(key, 2800, 4100, 5200, operator.address);

      const history = await contract.getPriceHistory(key);
      expect(history.length).to.equal(1);
      expect(history[0].farmerPrice).to.equal(2800);
      expect(history[0].traderPrice).to.equal(3400);
      expect(history[0].marketPrice).to.equal(4100);
      expect(history[0].consumerPrice).to.equal(5200);
      expect(history[0].reporter).to.equal(operator.address);
    });

    it("rejects prices exceeding consumer price", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-PRICE-2",
        "Chilli",
        "Guntur, Andhra Pradesh",
        harvest,
        hashMetadata("price-demo-2")
      );
      const key = await contract.getRecordKey("AGR-PRICE-2");

      // Farmer price higher than consumer price
      await expect(
        contract.connect(operator).recordPrice(key, 6000, 3400, 4100, 5200)
      ).to.be.revertedWith("AgriTrace: invalid farmer price");

      // Trader price higher than consumer price
      await expect(
        contract.connect(operator).recordPrice(key, 2800, 6000, 4100, 5200)
      ).to.be.revertedWith("AgriTrace: invalid trader price");

      // Market price higher than consumer price
      await expect(
        contract.connect(operator).recordPrice(key, 2800, 3400, 6000, 5200)
      ).to.be.revertedWith("AgriTrace: invalid market price");
    });

    it("rejects price recording for non-existent record", async function () {
      const { contract, operator } = await fixture();
      const dummyKey = ethers.keccak256(ethers.toUtf8Bytes("NON-EXISTENT"));
      await expect(
        contract.connect(operator).recordPrice(dummyKey, 100, 200, 300, 400)
      ).to.be.revertedWith("AgriTrace: record not found");
    });
  });

  describe("Sensor & Cold-Chain Monitoring", function () {
    it("records sensor observations and emits event", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-SENSOR-1",
        "Apple",
        "Shimla, Himachal Pradesh",
        harvest,
        hashMetadata("sensor-demo")
      );
      const key = await contract.getRecordKey("AGR-SENSOR-1");

      // 4.5°C = 450 centiC, 75.50% humidity = 7550 bps, 5.00% risk = 500 bps
      await expect(
        contract.connect(operator).recordSensorReading(key, 450, 7550, 500)
      )
        .to.emit(contract, "SensorReadingRecorded")
        .withArgs(key, 450, 7550, 500, operator.address);

      const history = await contract.getSensorHistory(key);
      expect(history.length).to.equal(1);
      expect(history[0].temperatureCentiC).to.equal(450);
      expect(history[0].humidityBps).to.equal(7550);
      expect(history[0].spoilageRiskBps).to.equal(500);
      expect(history[0].reporter).to.equal(operator.address);
    });

    it("supports negative temperatures (freezer/cold-storage)", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-SENSOR-2",
        "Frozen Berries",
        "Ooty, Tamil Nadu",
        harvest,
        hashMetadata("frozen-berries")
      );
      const key = await contract.getRecordKey("AGR-SENSOR-2");

      // -5.25°C = -525 centiC
      await contract.connect(operator).recordSensorReading(key, -525, 8000, 200);
      const history = await contract.getSensorHistory(key);
      expect(history[0].temperatureCentiC).to.equal(-525);
    });

    it("rejects out-of-bounds sensor values", async function () {
      const { contract, operator } = await fixture();
      const harvest = Math.floor(Date.now() / 1000) - 86400;
      await contract.connect(operator).createProduceRecord(
        "AGR-SENSOR-3",
        "Grapes",
        "Nashik, Maharashtra",
        harvest,
        hashMetadata("grapes-demo")
      );
      const key = await contract.getRecordKey("AGR-SENSOR-3");

      // Humidity > 10000 bps (100%)
      await expect(
        contract.connect(operator).recordSensorReading(key, 1200, 10001, 500)
      ).to.be.revertedWith("AgriTrace: humidity out of range");

      // Spoilage risk > 10000 bps (100%)
      await expect(
        contract.connect(operator).recordSensorReading(key, 1200, 6500, 10001)
      ).to.be.revertedWith("AgriTrace: risk out of range");
    });

    it("rejects sensor recording for non-existent record", async function () {
      const { contract, operator } = await fixture();
      const dummyKey = ethers.keccak256(ethers.toUtf8Bytes("NON-EXISTENT"));
      await expect(
        contract.connect(operator).recordSensorReading(dummyKey, 500, 7000, 100)
      ).to.be.revertedWith("AgriTrace: record not found");
    });
  });
});

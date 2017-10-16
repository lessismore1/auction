import { db, env } from "decentraland-commons";

export default {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.getEnv(
      "CONNECTION_STRING",
      "postgres://localhost:5432/auction"
    );

    await db.postgres.connect.call(this, CONNECTION_STRING);
    await this.createSchema();

    return this;
  },

  // -----------------------------------------------
  // Address State

  async findAddressState(address) {
    return await this.selectOne("address_states", {
      address
    });
  },

  async insertAddressState(address, { balance, lastBidGroupId }) {
    return await this.insert("address_states", {
      address,
      balance,
      lastBidGroupId
    });
  },

  // -----------------------------------------------
  // Helpers

  async createSchema() {
    // bids json = [{ x, y, amount }]
    await this.createTable(
      "bid_groups",
      `"id" int NOT NULL DEFAULT nextval('bid_groups_id_seq'),
      "prevId" int NOT NULL,
      "address" varchar(42) NOT NULL,
      "bids" json NOT NULL,
      "message" bytea DEFAULT NULL,
      "signature" bytea DEFAULT NULL,
      "timestamp" int NOT NULL`
    );

    // BidGroup denormalization, bid + index
    await this.createTable(
      "bid",
      `"id" int NOT NULL DEFAULT nextval('bid_id_seq'),
      "x" int NOT NULL,
      "y" int NOT NULL,
      "bidIndex" int NOT NULL,
      "address" varchar(42) NOT NULL,
      "amount" text NOT NULL,
      "timestamp" timestamp NOT NULL`
    );

    await this.createTable(
      "bid_receipts",
      `"id" int NOT NULL DEFAULT nextval('bid_receipts_id_seq'),
      "timeReceived" int NOT NULL,
      "messageHash" text NOT NULL,
      "serverAddress" text NOT NULL,
      "serverSignature" bytea DEFAULT NULL,
      "serverMessage" bytea DEFAULT NULL`
    );

    await this.createTable(
      "address_states",
      `"id" int NOT NULL DEFAULT nextval('address_states_id_seq'),
      "address" varchar(42) NOT NULL UNIQUE,
      "balance" text NOT NULL,
      "lastBidGroupId" int`
    );

    // id => string (hash of `x||','||y`)
    await this.createTable(
      "parcel_states",
      `"id" text NOT NULL,
      "x" int NOT NULL,
      "y" int NOT NULL,
      "address" varchar(42) NOT NULL,
      "amount" text,
      "endsAt" timestamp,
      "bidIndex" int,
      "bidGroupId" int`,
      { sequenceName: null }
    );
  }
};

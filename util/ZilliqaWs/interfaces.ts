export interface NewBlock {
  query: "NewBlock";
  value?: {
    TxBlock: {
      body: {
        BlockHash: string;
        HeaderSign: string;
        MicroBlockInfos: {
          MicroBlockHash: string;
          MicroBlockShardId: number;
          MicroBlockTxnRootHash: string;
        }[];
      };
      header: {
        BlockNum: string;
        DSBlockNum: string;
        GasLimit: string;
        GasUsed: string;
        MbInfoHash: string;
        MinerPubKey: string;
        NumMicroBlocks: number;
        NumPages: number;
        NumTxns: number;
        PrevBlockHash: string;
        Rewards: string;
        StateDeltaHash: string;
        StateRootHash: string;
        Timestamp: string;
        TxnFees: string;
        Version: number;
      };
    };
    TxHashes: string[][];
  };
}
export interface EventLog {
  query: "EventLog";
  addresses?: string[];
}
export interface TxnLog {
  query: "TxnLog";
  addresses?: string[];
  onMessage: (m: TxnLog) => void
  value?: {
    address: string;
    log: {
      ID: string;
      amount: string;
      fromAddr: string;
      success: boolean;
      toAddr: string;
    }[];
  }[];
}

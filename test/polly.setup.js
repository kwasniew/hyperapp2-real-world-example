import { setupMocha as setupPolly, Polly } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

setupPolly({
  adapters: ["node-http"],
  persister: "fs",
  recordIfMissing: true,
  recordFailedRequests: true,
  matchRequestsBy: {
    method: true,
    headers: true,
    body: true,
    order: false,

    url: {
      protocol: true,
      username: true,
      password: true,
      hostname: true,
      port: true,
      pathname: true,
      query: true,
      hash: false
    }
  }
});

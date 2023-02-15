import { WebClient as GatewayServiceClient } from "../proto/gateway/GatewayServiceClientPb";
import { QueryClient as QueryServiceClient } from "../proto/sgn/cbridge/v1/QueryServiceClientPb";
// tslint:disable-next-line:no-namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace window {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
  let __GRPCWEB_DEVTOOLS__: any;
}

export const queryServiceClient = new QueryServiceClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);
export const gatewayServiceClient = new GatewayServiceClient(`${process.env.REACT_APP_SERVER_URL}`, null, null);
export const gatewayServiceWithGrpcUrlClient = new GatewayServiceClient(
  `${process.env.REACT_APP_GRPC_SERVER_URL}`,
  null,
  null,
);
if (!(process.env.REACT_APP_ENV_TYPE === "mainnet" && process.env.NODE_ENV === "production")) {
  const enableDevTools =
    // eslint-disable-next-line no-underscore-dangle
    window.__GRPCWEB_DEVTOOLS__ ||
    (() => {
      console.info("grpc-web devtools plugin not detected");
    });
  enableDevTools([queryServiceClient, gatewayServiceClient, gatewayServiceWithGrpcUrlClient]);
}

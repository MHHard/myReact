// source: sdk/service/rfq/error.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.rfq.ErrCode', null, global);
/**
 * @enum {number}
 */
proto.rfq.ErrCode = {
  ERROR_UNDEFINED: 0,
  ERROR_COMMON: 1,
  ERROR_INVALID_REQUEST: 2,
  ERROR_MM_REJECTED_QUOTE: 3,
  ERROR_PRICE_DEADLINE: 4,
  ERROR_INVALID_SIG: 5,
  ERROR_INVALID_DEADLINE: 6
};

goog.object.extend(exports, proto.rfq);

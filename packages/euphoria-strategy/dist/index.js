"use strict";
// euphoria-strategy — the deterministic, backtestable "Strategy Skill" that
// powers Euphoria (BNB Hack Track 2). Pure functions, zero dependencies.
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBacktest = exports.signalFor = exports.computeFeatures = exports.clamp = exports.WARMUP = void 0;
var strategy_1 = require("./strategy");
Object.defineProperty(exports, "WARMUP", { enumerable: true, get: function () { return strategy_1.WARMUP; } });
Object.defineProperty(exports, "clamp", { enumerable: true, get: function () { return strategy_1.clamp; } });
Object.defineProperty(exports, "computeFeatures", { enumerable: true, get: function () { return strategy_1.computeFeatures; } });
Object.defineProperty(exports, "signalFor", { enumerable: true, get: function () { return strategy_1.signalFor; } });
var engine_1 = require("./engine");
Object.defineProperty(exports, "runBacktest", { enumerable: true, get: function () { return engine_1.runBacktest; } });
//# sourceMappingURL=index.js.map
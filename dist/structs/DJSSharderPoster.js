"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DJSSharderPoster = void 0;
const BasePoster_1 = require("./BasePoster");
/**
 * Auto-Poster For Discord.JS ShardingManager
 */
class DJSSharderPoster extends BasePoster_1.BasePoster {
    /**
     * Create a new poster
     * @param token Top.gg API Token
     * @param client Your Discord.JS ShardingManager
     * @param options Options
     */
    constructor(token, client, options) {
        if (!token)
            throw new Error('Missing Top.gg Token');
        if (!client)
            throw new Error('Missing client');
        const Discord = require('discord.js');
        // if (!(client instanceof Discord.ShardingManager)) throw new Error('Not a discord.js ShardingManager.')
        super(token, options);
        this.client = client;
        this._binder({
            clientReady: () => this.clientReady(),
            waitForReady: (fn) => this.waitForReady(fn),
            getStats: () => this.getStats()
        });
    }
    clientReady() {
        return this.client.clusters.size > 0 && [...this.client.clusters.values()].every(x => x.ready);
    }
    waitForReady(fn) {
        const listener = (shard) => {
            if (shard.id !== this.client.totalClusters - 1)
                return;
            this.client.off('clusterCreate', listener);
            shard.once('ready', () => {
                fn();
            });
        };
        this.client.on('clusterCreate', listener);
    }
    async getStats() {
        const response = await this.client.fetchClientValues('guilds.cache.size');
        return {
            serverCount: response.reduce((a, b) => a + b, 0),
            shardCount: this.client.totalShards
        };
    }
}
exports.DJSSharderPoster = DJSSharderPoster;

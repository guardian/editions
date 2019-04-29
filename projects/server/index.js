"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const thrift_server_core_1 = require("@creditkarma/thrift-server-core");
const codegen_1 = require("typescript-capi-thrift-experiment/codegen");
const key = process.env.capikey;
const app = express();
const port = 3131;
const url = (path) => `https://content.guardianapis.com/${path}?format=thrift&api-key=${key}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`;
const getArticle = async (path) => {
    const resp = await node_fetch_1.default(url(path));
    const buffer = await resp.arrayBuffer();
    const receiver = thrift_server_core_1.BufferedTransport.receiver(new Buffer(buffer));
    const input = new thrift_server_core_1.CompactProtocol(receiver);
    const data = codegen_1.ItemResponseCodec.decode(input);
    const title = data.content && data.content.webTitle;
    const body = data.content && data.content.blocks && data.content.blocks.body && data.content.blocks.body.map(_ => _.elements);
    return [title, body];
};
app.get('/', (req, res) => {
    const articles = [
        'books/2019/apr/23/tolkien-estate-disavows-forthcoming-film-starring-nicholas-hoult',
        'film/2019/apr/24/celeste-review-lush-verdant-visuals-spoiled-by-a-limp-and-soggy-storyline',
        'artanddesign/gallery/2019/apr/24/the-art-of-visual-storytelling-in-pictures',
        'artanddesign/gallery/2019/apr/23/phyllis-galembo-mexico-masks-and-rituals-in-pictures'
    ];
    Promise.all(articles.map(article => getArticle(article))).then(data => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

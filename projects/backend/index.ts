require("dotenv").config();

import express = require("express");
import fetch from "node-fetch";
import {
  BufferedTransport,
  CompactProtocol
} from "@creditkarma/thrift-server-core";
import { ItemResponseCodec } from "@guardian/capi-ts";
import { s3fetch } from './s3';
import { getIssue, getCollectionsForFront, getCollection } from './fronts';
const app = express();
// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log(`Example app listening on port 👌🏻!`))
console.log(process.env.CAPIKEY);
const port = 3131;
const url = (path: string) =>
  `https://content.guardianapis.com/${path}?format=thrift&api-key=${
    process.env.CAPIKEY
  }&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`;

const getArticle = async (path: string) => {
  const resp = await fetch(url(path));
  const buffer = await resp.arrayBuffer();

  const receiver: BufferedTransport = BufferedTransport.receiver(
    new Buffer(buffer)
  );
  const input = new CompactProtocol(receiver);

  const data = ItemResponseCodec.decode(input);
  const title = data && data.content && data.content.webTitle;
  const body =
    data &&
    data.content &&
    data.content.blocks &&
    data.content.blocks.body &&
    data.content.blocks.body.map(_ => _.elements);
  return [title, body];
};
app.get("/edition/:editionId", (req,res)=>{
    const id: string = req.params.editionId
    getIssue(id).then(data => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
})

app.get("/front/:frontId", (req,res)=>{
    const id: string = req.params.frontId
    getCollectionsForFront(id).then(data => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
})

app.get("/collection/:collectionId", (req,res)=>{
    const id: string = req.params.collectionId
    getCollection(id).then(data => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
})

app.get("/content/*?",(req,res)=>{
    console.log(req.params)
    const path: string = req.params[0]
    console.log(path)
    getArticle(path).then(data => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
})

app.get("/", (req, res) => {
  const articles = [
    "books/2019/apr/23/tolkien-estate-disavows-forthcoming-film-starring-nicholas-hoult",
    "film/2019/apr/24/celeste-review-lush-verdant-visuals-spoiled-by-a-limp-and-soggy-storyline",
    "artanddesign/gallery/2019/apr/24/the-art-of-visual-storytelling-in-pictures",
    "artanddesign/gallery/2019/apr/23/phyllis-galembo-mexico-masks-and-rituals-in-pictures"
  ];
  Promise.all(articles.map(article => getArticle(article)))
    .then(data => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(data));
    })
    .catch(err => console.error(err));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// /  facia-tool-store/CODE/frontsapi/edition/dd753c95-b0be-4f0c-98a8-3797374e71b6/edition.json
//    facia-tool-store/CODE/frontsapi/edition/dd753c95-b0be-4f0c-98a8-3797374e71b6/edition.json

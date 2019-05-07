import express = require("express");
import fetch from "node-fetch";
import {
  BufferedTransport,
  CompactProtocol
} from "@creditkarma/thrift-server-core";
import { ItemResponseCodec } from "@guardian/capi-ts";
const app = express();
// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log(`Example app listening on port 👌🏻!`))

const port = 3131;
const url = (path: string) =>
  `https://content.guardianapis.com/${path}?format=thrift&api-key=${
    process.env.capikey
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
app.get("/", (req, res) => {
  const articles = [
    "books/2019/apr/23/tolkien-estate-disavows-forthcoming-film-starring-nicholas-hoult",
    "film/2019/apr/24/celeste-review-lush-verdant-visuals-spoiled-by-a-limp-and-soggy-storyline",
    "artanddesign/gallery/2019/apr/24/the-art-of-visual-storytelling-in-pictures",
    "artanddesign/gallery/2019/apr/23/phyllis-galembo-mexico-masks-and-rituals-in-pictures"
  ];
  Promise.all(articles.map(article => getArticle(article))).then(data => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(data));
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

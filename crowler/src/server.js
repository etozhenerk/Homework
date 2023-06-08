const express = require("express");
const { fetcher } = require("../fetcher.js");

/*
    TODO: краулер страницы
    POST http://localhost:3000/parse
    body: { domainName: string}
    return string[]
*/

const app = express();
const port = 3000;

app.use(express.json());

app.post("/parse", async (request, response) => {
  const { domainName } = request.body;
  const visitedLinks = new Set();

  const stack = [domainName];

  while (stack.length) {
    const currentLink = stack.pop();
    if (!visitedLinks.has(currentLink)) {
      const data = await fetcher(currentLink);

      if (data.status === 200) {
        await setLinks(currentLink, visitedLinks, data, stack);
      } else if (data.status === 500) {
        const data = await fetcher(currentLink);
        if (data.status === 200) {
          await setLinks(currentLink, visitedLinks, data, stack);
        }
      }
    }
  }

  response.send([...visitedLinks]);
});

app.listen(port, (error) => {
  if (error) {
    return console.log("Error", error);
  }

  console.log("server is listening on port " + port);
});

const getLinksFromHtml = (htmlString) => {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const matches = htmlString.match(regex);

  return matches;
};

const setLinks = async (currentLink, visitedLinks, data, stack) => {
  visitedLinks.add(currentLink);
  const body = await data.text();
  const links = getLinksFromHtml(body);

  if (links !== null) {
    stack.push(...links);
  }
};

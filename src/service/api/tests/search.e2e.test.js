'use strict';

const createServer = require(`./create-server`);
const request = require(`supertest`);
const {HttpCode} = require(`@src/constants`);
const search = require(`@service/api/search`);

const mockData = require(`./mocks-data.json`);

const app = createServer(search, mockData);

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Борьба с прокрастинацией`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`Gsjp4f`));

});

test(`API returns code 404`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Несуществующий заголовок`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns code 400`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);

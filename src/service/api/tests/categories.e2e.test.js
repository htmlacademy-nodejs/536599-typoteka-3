'use strict';

const createServer = require(`./create-server`);
const request = require(`supertest`);
const {HttpCode} = require(`@src/constants`);
const categories = require(`@service/api/categories`);
const CategoryService = require(`@service/data-service/category-service`);

const mockData = require(`./mocks-data.json`);
const TEST_CATEGORIES_COUNT = 9;
const TEST_CATEGORIES = [
  `Музыка`,
  `Разное`,
  `За жизнь`,
  `Авто`,
  `Без рамки`,
  `IT`,
  `Железо`,
  `Кино`,
  `Программирование`
];

const сategoryService = new CategoryService(mockData);
const app = createServer(categories, сategoryService);

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`categories count`, () => expect(response.body.length).toBe(TEST_CATEGORIES_COUNT));
  test(`categories equal test array`, () => expect(response.body).toEqual(TEST_CATEGORIES));

});

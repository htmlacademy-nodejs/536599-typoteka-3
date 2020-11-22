'use strict';

const createServer = require(`./create-server`);
const request = require(`supertest`);
const {HttpCode} = require(`@src/constants`);
const articles = require(`@service/api/articles`);

const mockData = require(`./mocks-data.json`);

const TEST_ARTICLES_COUNT = 3;
const TEST_FIRST_ARTICLE_ID = `IQxM4v`;
const TEST_SECOND_ARTICLE_ID = `DZX6S2`;
const TEST_COMMENT_ID = `zDl7KE`;
const TEST_COMMENTS_COUNT = 3;

const validArticleData = {
  title: `Тестовая статья`,
  announce: `Анонс для тестовой статьи`,
  fullText: `Текст тетовой статьи`,
  createdDate: `2020-10-25 09:56:04`,
  сategory: [
    `Авто`,
    `Музыка`,
    `Разное`
  ],
};
const invalidArticleData = {
  announce: `Анонс для тестовой статьи`,
  fullText: `Текст тетовой статьи`,
  createdDate: `2020-10-25 09:56:04`,
  сategory: [],
};

const createApi = () => {
  const cloneData = JSON.parse(JSON.stringify(mockData));
  return createServer(articles, cloneData);
};

describe(`Get all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns articles`, () => expect(response.body.length).toBe(TEST_ARTICLES_COUNT));
});

describe(`Get article by id`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .get(`/articles/${TEST_FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns article by id`, () => {
    expect(response.body.id).toEqual(TEST_FIRST_ARTICLE_ID);
  });
});

describe(`Create new article`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .post(`/articles`)
      .send(validArticleData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return new article`, () => expect(response.body).toEqual(expect.objectContaining(validArticleData)));
});

describe(`Refuse create if data is invalid`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .post(`/articles`)
      .send(invalidArticleData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`Change existent article`, () => {
  let response;
  const app = createApi();

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${TEST_FIRST_ARTICLE_ID}`)
      .send(validArticleData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return new article`, () => expect(response.body).toEqual(expect.objectContaining(validArticleData)));
  test(`Get changed article`, async () => {
    await request(app)
      .get(`/articles/${TEST_FIRST_ARTICLE_ID}`)
      .expect((res) => expect(res.body.title).toBe(validArticleData.title));
  });
});

describe(`Change non-existent article`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .post(`/articles/noExist`)
      .send(validArticleData);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`Change existent article with invalid data`, () => {
  let response;

  beforeAll(async () => {
    const app = createApi();
    response = await request(app)
      .put(`/articles/${TEST_FIRST_ARTICLE_ID}`)
      .send(invalidArticleData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`Delete article`, () => {
  const app = createApi();

  test(`Delete existen article`, async () => {
    await request(app)
      .delete(`/articles/${TEST_FIRST_ARTICLE_ID}`)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.OK));
  });

  test(`Delete non-existen article`, async () => {
    await request(app)
      .delete(`/articles/NoExist`)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
  });

});

/* Comments tests */
describe(`API returns a list of comments by article id`, () => {

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${TEST_FIRST_ARTICLE_ID}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is "zDl7KE"`, () => expect(response.body[0].id).toBe(TEST_COMMENT_ID));

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${TEST_SECOND_ARTICLE_ID}/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/${TEST_SECOND_ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(TEST_COMMENTS_COUNT + 1))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createApi();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createApi();

  return request(app)
    .post(`/articles/${TEST_SECOND_ARTICLE_ID}/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${TEST_SECOND_ARTICLE_ID}/comments/${TEST_COMMENT_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(TEST_COMMENT_ID));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/${TEST_SECOND_ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createApi();

  return request(app)
    .delete(`/articles/${TEST_SECOND_ARTICLE_ID}/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createApi();

  return request(app)
    .delete(`/articles/NOEXST/comments/${TEST_COMMENT_ID}`)
    .expect(HttpCode.NOT_FOUND);

});

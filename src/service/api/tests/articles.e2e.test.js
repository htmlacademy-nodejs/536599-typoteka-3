'use strict';

const createServer = require(`./create-server`);
const request = require(`supertest`);
const {HttpCode} = require(`@src/constants`);
const articles = require(`@service/api/articles`);
const ArticleService = require(`@service/data-service/article-service`);

const mockData = require(`./mocks-data.json`);

const TEST_ARTICLES_COUNT = 3;
const TEST_FIRST_ARTICLE_ID = `IQxM4v`;
const TEST_COMMENT_ID = `9fbIZo`;
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

const services = new ArticleService(mockData);
const app = createServer(articles, services);

describe(`Get all articles`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns articles`, () => expect(response.body.length).toBe(TEST_ARTICLES_COUNT));
});

describe(`Get article by id`, () => {
  let response;

  beforeAll(async () => {
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
    response = await request(app)
      .post(`/articles`)
      .send(invalidArticleData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`Change existent article`, () => {
  let response;
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
    response = await request(app)
      .post(`/articles/noExist`)
      .send(validArticleData);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`Change existent article with invalid data`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${TEST_FIRST_ARTICLE_ID}`)
      .send(invalidArticleData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`Delete article`, () => {
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
  let response;

  beforeAll(async () => {
    const cloneData = JSON.parse(JSON.stringify(mockData));
    services.setData(cloneData);
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

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${TEST_FIRST_ARTICLE_ID}/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/${TEST_FIRST_ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(TEST_COMMENTS_COUNT + 1))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  return request(app)
    .post(`/articles/${TEST_FIRST_ARTICLE_ID}/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${TEST_FIRST_ARTICLE_ID}/comments/${TEST_COMMENT_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(TEST_COMMENT_ID));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/${TEST_FIRST_ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to delete non-existent comment`, () => {
  return request(app)
    .delete(`/articles/${TEST_FIRST_ARTICLE_ID}/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {
  return request(app)
    .delete(`/articles/NOEXST/comments/${TEST_COMMENT_ID}`)
    .expect(HttpCode.NOT_FOUND);

});

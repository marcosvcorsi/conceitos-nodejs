const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    likes: 0,
    title,
    url,
    techs,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

function validateRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  request.params.repositoryIndex = repositoryIndex;

  return next();
}

app.put("/repositories/:id", validateRepository, (request, response) => {
  const { id, repositoryIndex } = request.params;
  const { title, url, techs } = request.body;

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    likes,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepository, (request, response) => {
  const { repositoryIndex } = request.params;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepository, (request, response) => {
  const { repositoryIndex } = request.params;

  const currentRepository = repositories[repositoryIndex];
  const likes = currentRepository.likes + 1;

  const repository = {
    ...currentRepository,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json({ likes: repository.likes });
});

module.exports = app;

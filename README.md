# Phonebook Full Stack

## Link to the App

[Phonebook Full Stack](https://phonebook-full-stack.fly.dev/)

## Set the environment variables on Fly.io

```sh
fly secrets set MONGODB_URI='...'
```

## Tests

```sh
npm test -- tests/person_api.test.js
npm test -- -t "a specific person is within the returned persons"
npm test -- -t 'persons'
```

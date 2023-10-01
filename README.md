# Notifications Exercise

## Running Locally

1. Clone project locally

2. Install dependencies

```bash

npm  install

# or

yarn  install

# or

pnpm  install

```

3. Start server locally

```bash

npm  run  serve

# or

yarn  serve

# or

pnpm  serve

```

4. Start frontend locally

```bash

npm  run  dev

# or

yarn  dev

# or

pnpm  dev

```

## Data API

This api uses json-server, see official documentation to learn more about it: [https://github.com/typicode/json-server](https://github.com/typicode/json-server)

### All Notifications:

```
method: GET
route: http://localhost:3001/notifications
```

### Unseen notifications:

```
method: GET
route: http://localhost:3001/notifications?seen=false
```

### Paginated notifications:

- Use `_page` and optionally `_limit` to paginate returned data.

```
method: GET
route: http://localhost:3001/notifications?_page={pageNumber}&_limit={limit}
```

### Mark notification as seen:

```
method: PATCH
route: http://localhost:3001/notifications/{id}
```

### Mark all notifications as seen:

```
method: PUT
route: http://localhost:3001/notifications
```

### Post new notification:

```
method: POST
body: {
   {
      body: string,
      user?: string
    },
}
route: http://localhost:3001/notifications
```

### Response:

Headers:

- In the `Link` header you'll get `first`, `prev`, `next` and `last` links.

- `X-Total` header (total notifications count) and `X-Unseen` (total unseen notifications count) header are also included.

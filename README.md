# Notifications Exercise

## Running Locally

1. Clone project locally

2. Install JSON Server

```bash

npm install -g json-server

```

3. Install dependencies

```bash

npm  install

# or

yarn  install

# or

pnpm  install

```

4. Start server locally

```bash

npm  run  serve

# or

yarn  serve

# or

pnpm  serve

```

5. Start frontend locally

```bash

npm  run  dev

# or

yarn  dev

# or

pnpm  dev

```

## Data API

This api uses json-server, see official documentation to learn more about it: [https://github.com/typicode/json-server](https://github.com/typicode/json-server)

Notifications route:

```

http://localhost:3001/notifications

```

Unread notifications route:

```

http://localhost:3001/notifications?seen=false

```

Pagination:

```

http://localhost:3001/notifications?_page={pageNumber}&_limit={limit}

```

- Use `_page` and optionally `_limit` to paginate returned data.

Response:

- In the `Link` header you'll get `first`, `prev`, `next` and `last` links.

- `X-Total` header (total notifications count) and `X-Unseen` (total unseen notifications count) header are also included.

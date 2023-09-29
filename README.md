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

- In the `Link` header you'll get `first`, `prev`, `next` and `last` links and `unseenCount` (unseen notifications count).

- `X-Total-Count` header (total notifications count) is included in the response

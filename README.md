# Prisma

- [Prisma](#prisma)
	- [Quickstart](#quickstart)
		- [1. Create TypeScript project and set up Prisma](#1-create-typescript-project-and-set-up-prisma)
		- [2. Model data in the Prisma schema](#2-model-data-in-the-prisma-schema)
		- [3. Run a migration](#3-run-a-migration)
		- [4. Explore Prisma Client](#4-explore-prisma-client)

## Quickstart

### 1. Create TypeScript project and set up Prisma

Recommended `tsconfig.json`:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```

Installation:

```bash
yarn init -y
yarn add -D prisma ts-node typescript @types/node nodemon
yarn add @prisma/client
```

Finally, set up Prisma with the init command of the Prisma CLI:

```bash
npx prisma init --datasource-provider postgresql
```

Enable Auto Formatting in settings:

```json
 "[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma",
  "editor.formatOnSave": true
 }
```

Nodemon:

```json
 "scripts": {
  "dev": "nodemon script.ts"
 },
```

### 2. Model data in the Prisma schema

`prisma/schema.prisma:`

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

### 3. Run a migration

```bash
DATABASE_URL="postgresql://postgres:postgresx@localhost:5432/postgresdb"
```

Run Migration:

```bash
npx prisma migrate dev --name init
```

This command did two things:

- It creates a new SQL migration file for this migration in the prisma/migrations directory.
- It runs the SQL migration file against the database.

### 4. Explore Prisma Client

`script.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
 const user = await prisma.user.create({
  data: {
   name: 'Alice',
   email: 'alice@prisma.io'
  }
 });
 console.log(user);
}

main()
 .then(async () => {
  await prisma.$disconnect();
 })
 .catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
 });
```

Run script:

```bash
yarn dev
```

May need to run `npx prisma generate` to load schema definitions.

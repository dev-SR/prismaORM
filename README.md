# Prisma

- [Prisma](#prisma)
  - [Quickstart](#quickstart)
    - [1. Create TypeScript project and set up Prisma](#1-create-typescript-project-and-set-up-prisma)
    - [2. Model data in the Prisma schema](#2-model-data-in-the-prisma-schema)
    - [3. Run a migration](#3-run-a-migration)
    - [4. Explore Prisma Client](#4-explore-prisma-client)
    - [5. Prisma Studio Tour](#5-prisma-studio-tour)
  - [Models](#models)
    - [Defining models](#defining-models)
    - [🌟🌟Scalar fields](#scalar-fields)
      - [Defining an ID field](#defining-an-id-field)
      - [Defining a default value](#defining-a-default-value)
      - [Defining a unique field](#defining-a-unique-field)
      - [Defining an index](#defining-an-index)
      - [🥂Defining enums](#defining-enums)
    - [🌟🌟Relation fields](#relation-fields)
      - [🚀🚀One-to-many relations](#one-to-many-relations)
      - [🚀🚀One-to-one relations](#one-to-one-relations)
        - [Choosing which side should store the foreign key in a 1-1](#choosing-which-side-should-store-the-foreign-key-in-a-1-1)
      - [🚀🚀Many-to-many relations](#many-to-many-relations)
        - [Implicit many-to-many relations](#implicit-many-to-many-relations)
      - [🚀Self-relations](#self-relations)
        - [One-to-one self-relations](#one-to-one-self-relations)
        - [One-to-many self relations](#one-to-many-self-relations)
      - [🚀Disambiguating relations](#disambiguating-relations)
    - [Example](#example)
  - [🌟🌟CRUD operations](#crud-operations)
    - [👉CREATE](#create)
      - [Create a single record](#create-a-single-record)
      - [🥦Create multiple records🥦](#create-multiple-records)
      - [🍠🍠Create a related record](#create-a-related-record)

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
  //computed field ; not a part of table
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  Int
  //computed field ; not a part of table
  author    User    @relation(fields: [authorId], references: [id])
}
```

### 3. Run a migration

Config database url in `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgresx@localhost:5432/postgresdb"
```

Run Migration:

```bash
npx prisma migrate dev --name init
# or
npx prisma db push
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

### 5. Prisma Studio Tour

Run `npx prisma studio` in terminal.

<div align="center">
<img src="img/sps.jpg" alt="sps.jpg" width="400px">
</div>

## Models

### Defining models

`Models` represent the `entities` of your application domain. `Models` are represented by `model`  blocks and define a number of `fields`.

```prisma
model Comment {
  // Fields
}
```

Naming conventions:

- Model names must start with a letter and are typically spelled in `PascalCase`
- Model names should use the singular form (for example, `User` instead of `user`, `users` or `Users`)
- [prisma-schema-reference#naming-conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions)

### 🌟🌟Scalar fields

- [data-model#scalar-fields](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#scalar-fields)

The data source connector determines what **native database type** each of Prisma scalar type maps to. Similarly, the generator determines what type in the target programming language each of these types map to.

- `String` maps to `text` in the postgres db.
- `Boolean` maps to `boolean` in the postgres db.
- `Int` maps to `integer` in the postgres db.
- `Float` maps to `double precision` in the postgres db.
- `Decimal` maps to `decimal(65,30)` in the postgres db.
- `DateTime` maps to `timestamp(3)` in the postgres db.
- `Json` maps to `jsonb` in the postgres db.

```prisma
model Comment {
  id      Int
  title   String
  content String
}
```

See [complete list of scalar field types](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)

Some fields include [attributes](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-attributes):

Attributes modify the behavior of fields or model blocks. The following example includes three field attributes (`@id` , `@default` , and `@unique` ) and one block attribute (`@@unique`). Some attributes accept arguments  - for example, `@default(autoincrement())`:

#### Defining an ID field

An ID uniquely identifies individual records of a model. A model can only have one ID:

In relational databases, the ID can be a single field with or based on multiple fields. If a model does not have an `@id` or an `@@id`, you must define a **mandatory** `@unique` field or `@@unique` block instead.

```prisma
model User {
  id        Int     @id @default(autoincrement())
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)
}
```

**Composite IDs**:

In the following example, the User ID is represented by a combination of the firstName and lastName fields:

```prisma
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

#### Defining a default value

- [prisma-schema-reference#default](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#default)

-
You can define default values for scalar fields of your models using the @default  attribute:

**Default values can be**:

- **Static values** that correspond to the field type, such as `5` (Int), `Hello` (String), or `false` (Boolean)
- **Lists  of static values**, such as `[5, 6, 8]` (Int[]) or `["Hello", "Goodbye"]` (String[]). These are available in versions 4.0.0 and later, when using databases where Prisma supports them (PostgreSQL, CockroachDB and MongoDB)
- **Functions**, such as `now()`, `uuid()`,`autoincrement()`

#### Defining a unique field

Defines a compound unique constraint for the specified fields.

```prisma
model User {
  id        Int     @id @default(autoincrement())
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@unique([firstName, lastName])
}
```

#### Defining an index

You can define indexes on one or multiple fields of your models via the @@index  on a model. The following example defines a multi-column index based on the title and content field:

```prisma
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?

  @@index([title, content])
}
```

#### 🥂Defining enums

- [data-model#defining-enums](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-enums)
- []

You can define enums in your data model if enums are supported for your database connector, either natively or at Prisma level.

Enums are considered scalar types in the Prisma data model. They're therefore by default included as return values in Prisma Client queries.

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  role  Role    @default(USER)
}

enum Role {
  USER
  ADMIN
}
```

### 🌟🌟Relation fields

- [data-model#relation-fields](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#relation-fields)
- [https://www.prisma.io/docs/concepts/components/prisma-schema/relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations)

A relation field's type is another model - for example, a user (User) can have multiple posts (Post[]):

The following Prisma schema includes every type of relation:

- `1-1`: `User` ↔ `Profile`
- `1-n`: `User` ↔ `Post`
- `m-n`: `Post` ↔ `Category`

<div align="center">
  <img src="img/rel.jpg" alt="rel.jpg" width="800px">
</div>

#### 🚀🚀One-to-many relations

One-to-many (1-n) relations refer to relations where one record on one side of the relation can be connected to zero or more records on the other side.

```prisma
model User {
  id    Int    @id @default(autoincrement())
  //computed field:1->n: "a user can have zero or more posts"
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  //computed field:n->1: "a post must always have an author"
  author   User @relation(fields: [authorId], references: [id])
}
```

The following example demonstrates how to create a 1-n relation in SQL:

```sql
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY
);
CREATE TABLE "Post" (
    id SERIAL PRIMARY KEY,
    "authorId" integer NOT NULL,
    FOREIGN KEY ("authorId") REFERENCES "User"(id)
);
```

> Note on `computed fields`: The `posts` field does not "manifest" in the underlying database schema. On the other side of the relation, the annotated relation field `author` and its relation scalar `authorId` represent the side of the relation that stores the `foreign key` in the underlying database.

This one-to-many relation expresses the following:

- "a user can have zero or more posts"
- "a post must always have an author"

In the previous example, the `author` relation field of the `Post` model references the `id` field of the `User` model. **You can also reference a different field**. In this case, you need to mark the field with the `@unique` attribute, to guarantee that there is only a single `User` connected to each `Post`. In the following example, the `author` field references an email field in the `User` model, which is marked with the `@unique` attribute:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique // <-- add unique attribute
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [email])
}
```

**Required and optional relation fields in one-to-many relations:** In the following example, you can create a Post without assigning a User:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int   @id @default(autoincrement())
  author   User? @relation(fields: [authorId], references: [id])
  authorId Int?
}
```

**Comparing one-to-one and one-to-many relations:** In relational databases, the main difference between a `1-1` and a `1-n`-relation is that in a `1-1`-relation the foreign key must have a `UNIQUE` constraint defined on it.

#### 🚀🚀One-to-one relations

One-to-one (1-1) relations refer to relations where at most one record can be connected on both sides of the relation. In the example below, there is a one-to-one relation between User and Profile:

- [relations/one-to-one-relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-one-relations)

```prisma
model User {
  id      Int      @id @default(autoincrement())
  //computed field: "a user can have zero or one profiles" (because the profile field is optional on User)
  profile Profile? // No relation scalar - must be optional
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique // relation scalar field (used in the `@relation` attribute above)
  //computed field: "a profile must always be connected to one user"
  user   User @relation(fields: [userId], references: [id])
}
```

In a one-to-one relation, the side of the relation without a relation scalar (the field representing the `foreign key` in the database) **must be optional**:

The `userId` relation scalar is a direct representation of the `foreign key` in the underlying database. This one-to-one relation expresses the following:

- "a user can have zero or one profiles" (because the profile field is optional on User)
- "a profile must always be connected to one user"

The following example demonstrates how to create a 1-1 relation in SQL:

```sql
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY
);
CREATE TABLE "Profile" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL UNIQUE,
    FOREIGN KEY ("userId") REFERENCES "User"(id)
);
```

##### Choosing which side should store the foreign key in a 1-1

In 1-1 relations, you can decide yourself which side of the relation you want to annotate with the @relation attribute (and therefore holds the foreign key).

In the following example, the relation field on the Profile model is annotated with the @relation attribute. userId is a direct representation of the foreign key in the underlying database:

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique // relation scalar field (used in the `@relation` attribute above)
}
```

You can also annotate the other side of the relation with the @relation attribute. The following example annotates the relation field on the User model. profileId is a direct representation of the foreign key in the underlying database:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  profile   Profile? @relation(fields: [profileId], references: [id])
  profileId Int?     @unique // relation scalar field (used in the `@relation` attribute above)
}

model Profile {
  id   Int   @id @default(autoincrement())
  user User?
}
```

#### 🚀🚀Many-to-many relations

Many-to-many (m-n) relations refer to relations where zero or more records on one side of the relation can be connected to zero or more records on the other side of the relation.

In relational databases, `m-n`-relations are typically modelled via **relation tables**. m-n-relations can be either **explicit** or **implicit** in the Prisma schema.

- [relations/many-to-many-relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations)

##### Implicit many-to-many relations

Implicit many-to-many relations define relation fields as lists on both sides of the relation. Although the relation table exists in the underlying database, **it is managed by Prisma and does not manifest in the
Prisma schema**.

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

#### 🚀Self-relations

A relation field can also reference its own model, in this case the relation is called a self-relation. Self-relations can be of any cardinality, 1-1, 1-n and m-n.

[relations/self-relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations)

##### One-to-one self-relations

```prisma
model User {
  id          Int     @id @default(autoincrement())
  name        String?
  successorId Int?    @unique
  successor   User?   @relation("BlogOwnerHistory", fields: [successorId], references: [id])
  predecessor User?   @relation("BlogOwnerHistory")
}
```

This relation expresses the following:

- "a user can have one or zero predecessors" (for example, Sarah is Mary's predecessor as blog owner)
- "a user can have one or zero successors" (for example, Mary is Sarah's successor as blog owner)

##### One-to-many self relations

```prisma
model User {
  id        Int     @id @default(autoincrement())
  name      String?
  teacherId Int?
  teacher   User?   @relation("TeacherStudents", fields: [teacherId], references: [id])
  students  User[]  @relation("TeacherStudents")
}
```

This relation expresses the following:

- "a user has zero or one teachers "
- "a user can have zero or more students"

Note that you can also require each user to have a teacher by making the teacher field required.

#### 🚀Disambiguating relations

When you define two relations between two the same models, you need to add the `name` argument in the `@relation` attribute to disambiguate them. As an example for why that's needed, consider the following models:

```prisma
model User {
  id           Int     @id @default(autoincrement())
  name         String?
  writtenPosts Post[]
  pinnedPost   Post?
}

model Post {
  id         Int     @id @default(autoincrement())
  title      String?
  author     User    @relation(fields: [authorId], references: [id])
  authorId   Int
  pinnedBy   User?   @relation(fields: [pinnedById], references: [id])
  pinnedById Int?
}
```

In that case, the relations are ambiguous, there are four different ways to interpret them:

- `User.writtenPosts` ↔ `Post.author` + `Post.authorId`
- `User.writtenPosts` ↔ `Post.pinnedBy` + `Post.pinnedById`
- `User.pinnedPost` ↔ `Post.author` + `Post.authorId`
- `User.pinnedPost` ↔ `Post.pinnedBy` + Post.pinnedById`

To disambiguate these relations, you need to annotate the relation fields with the `@relation` attribute and provide the `name` argument. You can set any `name` (except for the empty string `""`), but it must be the same on both sides of the relation:

```prisma
model User {
  id           Int     @id @default(autoincrement())
  name         String?
  writtenPosts Post[]  @relation("WrittenPosts")
  pinnedPost   Post?   @relation("PinnedPost")
}

model Post {
  id         Int     @id @default(autoincrement())
  title      String?
  author     User    @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId   Int
  pinnedBy   User?   @relation(name: "PinnedPost", fields: [pinnedById], references: [id])
  pinnedById Int?
}
```

### Example

```prisma
model User {
  id             String          @id @default(uuid())
  name           String
  email          String          @unique
  age            Int
  role           Role            @default(BASIC)
  preferences    Json
  writtenPosts   Post[]          @relation("WrittenPosts")
  favoritePosts  Post[]          @relation("FavoritePosts")
  UserPreference UserPreference?

  @@unique([age, name])
  @@index([email])
}

model UserPreference {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user         User    @relation(fields: [userId], references: [id])
  userId       String  @unique
}

model Post {
  id            Int      @id @default(autoincrement())
  title         String
  content       String?
  averageRating Float
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  published     Boolean    @default(false)
  author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String
  favoritedBy   User?      @relation("FavoritePosts", fields: [favoritedById], references: [id])
  favoritedById String?
  categories    Category[]
}

model Category {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}

enum Role {
  BASIC
  ADMIN
}
```

## 🌟🌟CRUD operations

- [/crud](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [/relation-queries](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries)

### 👉CREATE

- [https://www.prisma.io/docs/concepts/components/prisma-client/crud#create](https://www.prisma.io/docs/concepts/components/prisma-client/crud#create)

#### Create a single record

```typescript
async function main() {
 const user = await prisma.user.create({
  data: {
   name: 'Jhon',
   email: 'jhon@gmail.com',
   age: 20,
   role: 'BASIC'
  }
 });
 console.log(user);
}
```

The user's `id` is auto-generated

#### 🥦Create multiple records🥦

The following `createMany`  query creates multiple users and skips any duplicates (email must be unique):

```typescript
async function main() {
 const user = await prisma.user.createMany({
  data: [
   { name: 'Bob', email: 'bob@prisma.io', age: 20, role: 'BASIC' },
   { name: 'Bobo', email: 'bob@prisma.io', age: 20, role: 'BASIC' }, // Duplicate unique key!
   { name: 'Yewande', email: 'yewande@prisma.io', age: 20, role: 'BASIC' },
   { name: 'Angelique', email: 'angelique@prisma.io', age: 20, role: 'BASIC' }
  ],
  skipDuplicates: true // Skip 'Bobo'
 });
 console.log(user);
}
```

#### 🍠🍠Create a related record

- [https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes)

You can create a record and one or more related records at the same time. The following query creates a User record and two related Post records:


```typescript
async function main() {
 const user = await prisma.user.create({
  data: {
   name: 'Jhon',
   email: 'jhon2@gmail.com',
   age: 25,
   role: 'BASIC',
   writtenPosts: {
    create: [
     {
      title: 'Learn Python',
      averageRating: 0
     },
     {
      title: 'Learn Typescript',
      averageRating: 0
     },
     {
      title: 'Learn Java',
      averageRating: 0
     }
    ]
   }
  },
  include: {
   writtenPosts: true
  }
 });
 console.log(user);
}
```

There are two ways to create or update a single record and multiple related records - for example, a user with mutiple posts:

- Use a nested `create`  query
- Use a nested `createMany`  query

For more feature like `Connect an existing record`,`Connect or create a record`, `Disconnect related records` etc..see the documentation.

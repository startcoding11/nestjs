# nvm

npm list -g --depth=0
corepack enable
yarn

```bash  
yarn add @nestjs/common @nestjs/config @nestjs/core @nestjs/jwt @nestjs/passport @nestjs/platform-express @nestjs/swagger \
@nestjs/typeorm class-transformer class-validator jsonwebtoken lodash nanoid passport passport-local mysql pg reflect-metadata \
rimraf rxjs service sqlite3 typeorm webpack 
```

```bash
yarn add -D \
    @eslint/eslintrc \
    @eslint/js \
    @nestjs/cli \
    @nestjs/schematics \
    @nestjs/testing \
    @swc/cli \
    @swc/core \
    @types/express \
    @types/jest \
    @types/jsonwebtoken \
    @types/lodash \
    @types/node \
    @types/passport-local \
    @types/mysql \
    @types/pg \
    @types/supertest \
    eslint \
    eslint-config-prettier \
    eslint-plugin-prettier \
    globals \
    jest \
    prettier \
    source-map-support \
    supertest \
    ts-jest \
    ts-loader \
    ts-node \
    tsconfig-paths \
    typescript \
    typescript-eslint 
```



# nestjs

NestJS boilerplate

npx nest generate module conf --no-spec
npx nest generate service conf --no-spec

npx nest generate module api --no-spec
npx nest generate module api/core --no-spec
npx nest generate module api/modules --no-spec
npx nest generate module api/v1 --no-spec

npx nest generate resource api/core/admin --no-spec
npx nest generate resource api/modules/v1/administrator --no-spec
npx nest generate resource api/modules/v1/users --no-spec

npx nest generate service api/core/auth --no-spec

# nvm

npm list -g --depth=0
corepack enable
yarn

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

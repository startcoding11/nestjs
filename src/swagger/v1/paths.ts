export default {
  '/auth/user/register': {
    post: {
      tags: ['Auth'],
      summary: 'User registration - Create a new user',
      operationId: 'createUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateUserRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserResponse',
              },
            },
          },
        },
      },
    },
  },
};

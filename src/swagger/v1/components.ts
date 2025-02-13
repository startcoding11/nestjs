export default {
  schemas: {
    CreateUserRequest: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          minLength: 8,
        },
      },
      required: ['firstName', 'lastName', 'email', 'password'],
    },
    CreateUserResponse: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
      required: ['userId', 'firstName', 'lastName', 'email', 'createdAt'],
    },
  },
};

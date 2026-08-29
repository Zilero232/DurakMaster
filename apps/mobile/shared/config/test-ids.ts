export const TEST_ID = {
  auth: {
    email: 'auth-email',
    password: 'auth-password',
    submit: 'auth-submit'
  },

  nav: {
    tab: (id: string) => `tab-${id}`
  },

  lobby: {
    createSubmit: 'create-table-submit'
  },

  table: {
    ready: 'table-ready',
    addBot: 'table-add-bot',
    take: 'table-take',
    pass: 'table-pass',
    leave: 'table-leave',
    surrenderConfirm: 'table-surrender-confirm'
  }
} as const;

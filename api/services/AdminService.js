'use strict';

const AdminService = {
  /**
   * Create default a admin
   */
  defaultAdmin: async () => {
    const admins = await Admin.count();
    if (!admins) {
      const admin = {
        email: 'admin@gmail.com',
        password: '123123',
        nickname: 'Admin',
        gender: 1
      };
      await Admin.create(admin);
    }
  }
};

module.exports = AdminService;

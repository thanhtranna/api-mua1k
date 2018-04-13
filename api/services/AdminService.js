'use strict';

const AdminService = {
  /**
   * Create default a admin
   */
  defaultAdmin: async () => {
    const admins = await Admin.count();
    if (!admins) {
      const admin = {
        email: 'admin@tokubuy.com',
        password: 'tokubuy',
        nickname: 'Tokubuy',
        gender: 1
      };
      await Admin.create(admin);
    }
  }
};

module.exports = AdminService;

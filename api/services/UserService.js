'use strict';

const jwt = require('jsonwebtoken');

const UserService = {
  /**
   *
   * @param email
   * @param password
   * @return {Promise.<*>}
   */
  login: async (email, password, model) => {
    try {
      const user = await model
        .findOne({ email })
        .select('_id password')
        .lean();
      if (!user) return null;

      const isPasswordCorrect = await BcryptService.compare(
        password,
        user.password
      );
      if (!isPasswordCorrect) return null;

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @param user
   * @return {*}
   */
  generateUserToken: user => {
    return jwt.sign(user, sails.config.jwtSecret, {
      expiresIn: sails.config.jwtExpiredIn
    });
  },

  /**
   *
   * @return {Promise.<void>}
   */
  snsLogin: async (token, socialType, req) => {
    try {
      let options = {};
      // Facebook
      options[User.socials.facebook] = {
        uri: `https://graph.facebook.com/me?access_token=${token}`,
        bearer: false,
        idField: 'id',
        nickNameField: 'name',
        getAvatar: profile => {
          return {
            thumb: `https://graph.facebook.com/${
              profile[this.idField]
              }/picture?width=150&height=150`,
            origin: `https://graph.facebook.com/${
              profile[this.idField]
              }/picture?width=500&height=500`
          };
        }
      };
      // Line
      options[User.socials.line] = {
        uri: 'https://api.line.me/v2/profile',
        bearer: token,
        idField: 'userId',
        nickNameField: 'displayName',
        getAvatar: profile => {
          return {
            thumb: profile.pictureUrl,
            origin: profile.pictureUrl
          };
        }
      };
      // Twitter
      options[User.socials.twitter] = {};

      const option = options[socialType],
        profile = await HttpService.get(option.uri, option.bearer);

      const user = await User.findOne({
        socialId: profile[option.idField],
        socialType: socialType
      }).select('id');

      if (!user) {
        const userIpAddress = sails.helpers.getUserIpAddress();
        const device = sails.helpers.getUserDevice(req.header['user-agent']);
        user = new User({
          nickname: profile[option.nickNameField],
          avatar: option.getAvatar(profile),
          socialId: profile[option.idField],
          socialType: socialType,
          isVerified: true,
          ip: userIpAddress,
          device: device || 'undefined'
        });
        await user.save();
      }

      return UserService.generateUserToken({ _id: user._id });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserService;

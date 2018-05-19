/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require("jsonwebtoken");
const generate = require("generate-key");
const request = require("request");

const VERIFY_CODE = sails.config.environment === "production" ? null : "123456";

module.exports = {
  /**
   * Get login
   * Return login view
   */
  getLogin: asyncWrap(async (req, res) => {
    res.render("index");
  }),

  /**
   * Register Email
   *    check email - create user & send verify email
   * Params
   *    {string} email
   * Polices
   *    validator/common/validateEmail
   * @return {string} user id e.g. 59a36f7c3bbde09a03487960
   */
  postRegisterEmail: asyncWrap(async (req, res) => {
    const { email, password } = req.body;
    if (sails.config && sails.config.isDemo === true) {
      const user = await User.findOne({ email }).lean(true);
      if (!user) {
        const dataCreate = {
          email,
          nickname: email,
          password,
          isVerified: true
        };
        await User.create(dataCreate);
        return res.created({
          data: {
            email,
            password
          },
          message: "Created account success"
        });
      } else {
        const pass = await BcryptService.hash(password);
        await User.update({ email }, { $set: { password: pass } });
        return res.created({
          data: {
            email,
            password: pass
          },
          message: "Created account success"
        });
      }
    }
    const findUser = await User.findOne({ email }).select("isVerified");

    if (findUser) {
      if (findUser.isVerified)
        return res.badRequest(sails.errors.emailHasExistAndVerified);
      return res.badRequest(sails.errors.emailHasExistAndNotVerify);
    }

    // Create User
    const verifyCode = VERIFY_CODE || sails.helpers.randomNumber();
    const user = await User.create({ email, verifyCode });

    // Fire event `account.register.email`
    EventEmitter.emit("account.register.email", user);

    res.ok({ data: user.id });
  }),

  postRegister: asyncWrap(async (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    console.log(req.body);
    // Get IP Address user.
    const userIpAddress = sails.helpers.getUserIpAddress();

    const user = new User({
      nickname: username,
      email: email,
      password: password,
      avatar: {
        "origin": "/images/avatar.jpg",
        "thumb": "/images/avatar.jpg"
      },
      isVerified: true,
      ip: userIpAddress
    });
    const newUser = await user.save();

    if (newUser) {
      // Create Coin, Point user.
      await Promise.all([
        UserCoin.create({ user: newUser._id, coin: 0 }),
        UserPoint.create({ user: newUser._id, point: 0 })
      ]);
    }
    const token = UserService.generateUserToken({ _id: newUser.id });
    return res.ok({ data: token });
  }),
  /**
   * Login via Facebook
   */
  postLoginFacebook: asyncWrap(async (req, res) => {
    const { token } = req.body;

    const userToken = await UserService.snsLogin(
      token,
      User.socials.facebook,
      req
    );

    res.ok({ data: userToken });
  }),

  /**
   * Login via Twitter
   */
  postLoginTwitter: asyncWrap(async (req, res) => {
    const { token } = req.body;

    res.ok({ data: token });
  }),

  /**
   * Login via Line
   */
  postLoginLine: asyncWrap(async (req, res) => {
    const { token } = req.body;

    const userToken = await UserService.snsLogin(token, User.socials.line, req);

    res.ok({ data: userToken });
  }),

  /**
   * Verify Register
   *    verify code - update user information & sign in
   * Params
   *    {string} userId: user id
   *    {string} nickname
   *    {number} invitationUserId: invitation user id
   *    {string} password
   * Polices
   *    validator/user/verifyRegister
   * @return {string} json web token
   */
  postVerifyRegister: asyncWrap(async (req, res) => {
    const {
      userId,
      nickname,
      invitationUserId,
      password,
      deviceToken
    } = req.body;

    const passwordHashed = await BcryptService.hash(password);
    const userIpAddress = sails.helpers.getUserIpAddress();
    const device = sails.helpers.getUserDevice(req.header["user-agent"]);

    // Create User information object
    const userData = {
      nickname: nickname,
      password: passwordHashed,
      isVerified: true,
      device: device || "undefined",
      deviceToken
    };
    if (invitationUserId) {
      userData.invitationUserId = invitationUserId;
      const user = await User.findOne({ _id: userId });
      await PointRepository.pointViaInviteFriend(invitationUserId, user);
    }
    if (userIpAddress) userData.ip = userIpAddress;

    // Update User information
    const user = await User.findOneAndUpdate({ _id: userId }, userData, {
      new: true
    });

    // Let make User sign in and return token
    const token = UserService.generateUserToken({ _id: user.id });

    res.ok({ data: token });
  }),

  /**
   * Login
   * Params
   *    {string} email
   *    {string} password
   * Polices
   *    validator/common/validateEmail
   *    validator/common/validatePassword
   * @return {string} json web token
   */
  postLogin: asyncWrap(async (req, res) => {
    const { email, password, deviceToken } = req.body;
    const user = await UserService.login(email, password, User);

    if (!user) return res.badRequest(sails.errors.wrongPasswordOrEmail);

    const token = UserService.generateUserToken(user);
    await User.update({ email }, { $set: { deviceToken: deviceToken } });
    res.ok({ data: token });
  }),

  /**
   * Resend email verifyCode
   * Params
   *    {string} email
   * Polices
   *    validator/common/validateEmail
   * @return null
   */
  postResendRegisterVerifyCode: asyncWrap(async (req, res) => {
    let email = req.body.email;
    let user = await User.findOne({ email });
    if (!user) return res.badRequest(sails.errors.userNotFound);
    if (user.isVerified) return res.badRequest(sails.errors.userHasVerified);

    // Every ok, let generate new verifyCode, resend email and update user
    let verifyCode = VERIFY_CODE || sails.helpers.randomNumber();
    let newUser = await User.findOneAndUpdate(
      { email },
      { verifyCode },
      { new: true }
    );

    // Fire Event 'account.register.resendEmail'
    EventEmitter.emit("account.register.resendEmail", newUser);

    res.ok({
      data: { userId: user.id }
    });
  }),

  /**
   * Send reset password code
   *    create token for reset password - send mail contain verify code
   * Params
   *    {string} email
   * Polices
   *    validator/common/validateEmail
   * @return {string} json web token
   */
  postSendResetPasswordCode: asyncWrap(async (req, res) => {
    let email = req.body.email;

    let user = await User.findOne({ email });
    if (!user) return res.badRequest(sails.errors.userNotFound);

    // Generate verifyCode, token
    let verifyCode = VERIFY_CODE || sails.helpers.randomNumber(),
      tokenSecret = sails.config.jwtSecret + verifyCode;
    let token = jwt.sign({ email }, tokenSecret, {
      expiresIn: sails.config.jwtResetPasswordExpiredIn
    });

    await EmailService.sendResetPasswordCode({ email, verifyCode });

    res.ok({ data: token });
  }),

  /**
   * Verify reset password code
   * Params
   *    {string} reset_token
   *    {string} verifyCode
   * Polices
   *    validator/user/verifyResetPasswordCode
   * @return null
   */
  postVerifyResetPassword: function (req, res) {
    res.ok();
  },

  /**
   * Update new password in flow reset password
   * Params
   *    {string} reset_token
   *    {string} verifyCode
   *    {string} password: is new password
   * Polices
   *    validator/user/verifyResetPasswordCode
   *    validator/common/validatePassword
   * @return null
   */
  postResetPassword: asyncWrap(async (req, res) => {
    // Every ok, let hash and update password for user
    let password = req.body.password,
      email = req.jwtDecoded.email;
    let passwordHashed = await BcryptService.hash(password);
    await User.update({ email }, { password: passwordHashed });

    res.ok();
  }),

  /**
   * Update User Invitation when register with SNS
   */
  updateInvitationUser: asyncWrap(async (req, res) => {
    let userInviteId = req.body.invitationUserId;
    let user = req.user;
    await PointRepository.pointViaInviteFriend(userInviteId, user);
    await User.findByIdAndUpdate(user._id, {
      invitationUserId: userInviteId
    });

    return res.ok();
  }),

  /**
   * Logout
   */
  getLogout: asyncWrap(async (req, res) => {
    let id = req.user._id;
    let user = await UserRepository.deleteDeviceToken(id);
    if (!user) res.badRequest(sails.errors.logoutFail);
    res.ok({});
  })
};
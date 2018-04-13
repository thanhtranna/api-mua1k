'use strict';

const errors = {
  emailHasExist: {
    message: 'email_exist',
    code: 1
  },
  emailNotExist: {
    message: 'email_not_exit',
    code: 2
  },
  wrongPasswordOrEmail: {
    message: 'パスワードまたはメールアドレスは正しくありません。',
    code: 3
  },
  userHasVerified: {
    message: 'user_has_verified',
    code: 4
  },
  auctionNotFound: {
    // auction not found or maybe it is deleted (soft delete)
    message: 'auction_not_found',
    code: 5
  },
  deleteUserFail: {
    message: 'delete_user_fail',
    code: 7
  },
  deleteAuctionFail: {
    message: 'delete_auction_fail',
    code: 6
  },
  verifyRegisterRequireUserId: {
    message: 'verify_register_require_user_id',
    code: 6
  },
  verifyCodeIsIncorrect: {
    message: 'verify_code_is_incorrect',
    code: 7
  },
  verifyCodeTimeout: {
    message: 'verify_code_timeout',
    code: 8
  },
  invitationUserIdRequireNumber: {
    message: 'invitation_user_id_require_number',
    code: 9
  },
  invitationUserNotFound: {
    message: 'invitation_user_not_found',
    code: 10
  },
  userNotFound: {
    message: 'user_not_found',
    code: 11
  },
  requireResetToken: {
    message: 'require_reset_token',
    code: 12
  },
  codeIncorrectOrTimeOut: {
    message: 'code_incorrect_or_timeout',
    code: 13
  },
  categoryNotFound: {
    message: 'category_not_found',
    code: 14
  },
  idMalformed: {
    message: 'id_malformed',
    code: 15
  },
  validationError: {
    message: 'validation_error',
    code: 16
  },
  getProductFail: {
    message: 'get_product_fail',
    code: 17
  },
  createProductFail: {
    message: 'create_product_fail',
    code: 18
  },
  logUser: {
    userCoinChange: {
      message: 'log_user_coin_change_fail',
      code: 19
    },
    auctionWinner: {
      message: 'log_auction_winner_fail',
      code: 20
    },
    userPoint: {
      message: 'log_user_point',
      code: 21
    },
    review: {
      message: 'log_review',
      code: 22
    },
    avatar: {
      message: 'avatar_is_required',
      code: 23
    }
  },
  auctionsParamMalformed: {
    message: 'auctions_param_malformed',
    code: 23
  },
  auctionIdNullOrMalformed: {
    message: 'auction_id_null_or_malformed',
    code: 24
  },
  amountMalformed: {
    message: 'amount_malformed',
    code: 25
  },
  auctionNotEnoughChances: {
    message: 'auction_not_enough_chances',
    code: 26
  },
  auctionSoldOut: {
    message: 'auction_sold_out',
    code: 27
  },
  authenticatedFail: {
    message: 'authenticated_fail',
    code: 28
  },
  createReviewRequireWinner: {
    message: 'create_review_require_winner',
    code: 29
  },
  requireReviewContent: {
    message: 'require_review_content',
    code: 30
  },
  requireReviewId: {
    message: 'require_review_id',
    code: 31
  },
  reviewNotFound: {
    message: 'review_not_found',
    code: 32
  },
  requireKeyword: {
    message: 'require_keyword',
    code: 33
  },
  requireToken: {
    message: 'require_token',
    code: 34
  },
  addressNotExist: {
    message: 'address_not_exist',
    code: 35
  },
  pointNotEnough: {
    message: 'point_not_enough',
    code: 36
  },
  pointIsInvalid: {
    message: 'point_is_invalid',
    code: 37
  },
  checkinFail: {
    message: 'checkin_fail',
    code: 38
  },
  createAuctionFail: {
    message: 'create_auction_fail',
    code: 38
  },
  productNotFound: {
    message: 'product_not_found',
    code: 39
  },
  updateAuctionFail: {
    message: 'update_auction_fail',
    code: 40
  },
  noPermissionReview: {
    message: 'no_permission_review',
    code: 41
  },
  reviewExist: {
    message: 'review_exist',
    code: 42
  },
  userHasInvitationUser: {
    message: 'user_has_invitation_user',
    code: 43
  },
  contactCategoryNotExist: {
    message: 'contact_category_not_exist',
    code: 44
  },
  auctionNotFinishOrMalformed: {
    message: 'auction_not_finish_or_malformed',
    code: 45
  },
  deleteCampaignFail: {
    message: 'delete_campaign_fail',
    code: 46
  },
  emailHasExistAndVerified: {
    message: 'email_has_exist_and_verified',
    code: 47 // do not change
  },
  emailHasExistAndNotVerify: {
    message: 'email_has_exist_and_not_verify',
    code: 48 // do not change
  },
  userInviteIdNotExist: {
    message: 'user_invite_id_not_exist',
    code: 49
  },
  createCampaignFail: {
    message: 'create_campaign_fail',
    code: 50
  },
  updateCampaignFail: {
    message: 'update_campaign_fail',
    code: 51
  },
  conditionNotFound: {
    message: 'condition_not_found',
    code: 52
  },
  findLuckyNumberFailed: {
    message: 'Find lucky number failed',
    code: 53
  },
  auctionFinished: {
    message: 'auction_finished',
    code: 54
  },
  auctionFailed: {
    message: 'auction_failed',
    code: 55
  },
  auctionWaitingResult: {
    message: 'auction_is_running_lucky_number',
    code: 56
  },
  enoughCoinChanceBuy: {
    message: 'enough_coin_chance_buy',
    code: 57
  },
  userWithoutAnyFriend: {
    message: 'without_any_friend',
    code: 58
  },
  winnerNotFound: {
    message: 'winner_not_found',
    code: 59
  },
  deleteContactFail: {
    message: 'contact_not_found',
    code: 60
  },
  logoutFail: {
    message: 'logout_fail',
    code: 61
  },
  discountTicketsParamMalformed: {
    message: 'discount_tickets_param_malformed',
    code: 62
  },
  discountTicketIdNullOrMalformed: {
    message: 'discount_ticket_id_null_or_malformed',
    code: 63
  },
  discountTicketNotFound: {
    message: 'discount_ticket_not_found',
    code: 64
  },
  valueDiscountMalformed: {
    message: 'value_discount_malformed',
    code: 65
  },
  discountTicketExpired: {
    message: 'discount_ticket_expired',
    code: 66
  },
  totalBuyLesserTotalDiscount: {
    message: 'total_buy_lesser_total_discount',
    code: 67
  },
  createReportFail: {
    message: 'create_report_fail',
    code: 68
  },
  sentReport: {
    message: 'sent_reported',
    code: 69
  },
  userNotExist: {
    message: 'user_not_exist',
    code: 70
  },
  userBlocked: {
    message: 'user_blocked',
    code: 71
  },
  confirmPasswordFail: {
    message: 'パスワードを認証するは必須です。',
    code: 72
  },
  emailAdminExists: {
    message: '選択されたメールアドレスは正しくありません。',
    code: 73
  },
  comparePasswordFail: {
    message: 'パスワードは確認用項目と一致していません。',
    code: 74
  }
};

module.exports = {
  error: (errorCode, req) => {
    if (!errorCode || !req)
      throw Error('sails.error require `errorCode` & `req` parameters');

    let error = errors[errorCode];
    if (!error) throw new Error('Not Found Error in sails/config/errors.js');

    return {
      message: req.__(error.message),
      code: error.code
    };
  },

  errors: errors,

  getError: error => {
    if (!error) throw new Error('Not found error: ' + error);

    return error;
  }
};

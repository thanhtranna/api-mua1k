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
    message: 'wrong_password_or_email',
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

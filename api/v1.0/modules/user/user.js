const functions = require('../../../../common/functions');
const config = require('../../../../config');
const validator = require('validator');
const statusCode = require('../../../../common/statusCode');
const message = require('../../../../common/message');
const fs = require('fs');
const db = require('./mysql');

class UserService {
  /**
   * API for user registration
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async registration(info) {
    try {
      if (
        !validator.isEmail(info.emailAddress) ||
        validator.isEmpty(info.userPassword) ||
        validator.isEmpty(info.fullName) ||
        validator.isEmpty(info.mobileNumber)
      ) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }

      const checkIfuserExists = await db.userDatabase().checkIfuserExists(info);

      if (checkIfuserExists.length > 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.duplicateDetails,
          data: null,
        };
      }

      info.userPassword = functions.encryptPassword(info.userPassword);

      const userRegistration = await db.userDatabase().userRegistration(info);

      return {
        statusCode: statusCode.success,
        message: message.registration,
        data: userRegistration,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error.data),
      };
    }
  }

  /**
   * API for user login
   * @param {*} req (email address & password)
   * @param {*} res (json with success/failure)
   */
  async login(info) {
    try {
      if (!validator.isEmail(info.emailAddress)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }

      const loginDetails = await db.userDatabase().getUser(info.emailAddress);

      if (loginDetails.length <= 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }
      const password = functions.decryptPassword(loginDetails[0].user_password);
      if (password !== info.userPassword) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }

      delete loginDetails[0].user_password;

      const token = await functions.tokenEncrypt(loginDetails[0]);

      loginDetails.token = token;

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: { userDetails: loginDetails[0], token: token },
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for user history
   * @param {*} req (userId)
   * @param {*} res (json with success/failure)
   */
  async getProfile(emailAdress) {
    try {
      const getProfileDetails = await db.userDatabase().getUser(emailAdress);
      if (getProfileDetails.length > 0) {
        delete getProfileDetails[0].user_password;
        return {
          statusCode: statusCode.success,
          message: message.success,
          data: getProfileDetails[0],
        };
      } else {
        return {
          statusCode: statusCode.bad_request,
          message: message.noData,
          data: null,
        };
      }
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API to update profile
   * @param {*} req (token, user information )
   * @param {*} res (json with success/failure)
   */
  async updateProfile(email, info) {
    try {
      if (validator.isEmpty(info.fullName)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.allFieldReq,
          data: null,
        };
      }

      const userDetail = await db.userDatabase().updateUser(email, info);

      return {
        statusCode: statusCode.success,
        message: message.profileUpdate,
        data: userDetail,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for adding requester info
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async addRequester(info) {
    try {
      if (
        validator.isEmail(info.fullName) ||
        validator.isEmpty(info.bloodGroup) ||
        validator.isEmpty(info.mobileNumber)
      ) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }

      const addRequester = await db.userDatabase().addRequester(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: addRequester,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error.data),
      };
    }
  }

  /**
   * API for getting requester info
   * @param {*} req ()
   * @param {*} res (json with success/failure)
   */
  async getRequester(info) {
    try {
      const getRequester = await db.userDatabase().getRequester(info);
      return {
        statusCode: statusCode.success,
        message: message.success,
        data: getRequester,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error.data),
      };
    }
  }

  /**
   * API for updating requester info
   * @param {*} req ()
   * @param {*} res (json with success/failure)
   */
  async updateRequester(requesterId) {
    try {
      const updateRequester = await db
        .userDatabase()
        .updateRequester(requesterId);
      return {
        statusCode: statusCode.success,
        message: message.success,
        data: updateRequester,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error.data),
      };
    }
  }
}

module.exports = {
  userService: function () {
    return new UserService();
  },
};

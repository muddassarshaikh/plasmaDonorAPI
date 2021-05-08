const con = require('../../../../common/mysql');
const util = require('util');
const query = util.promisify(con.query).bind(con);
const { databaseInitial } = require('../../../../config');
const { connection_failed } = require('../../../../common/statusCode');

class UserDatabase {
  /**
   * Database call to check if user exists
   * @param {*} req (email address & mobileNumber)
   * @param {*} res (json with success/failure)
   */
  async checkIfuserExists(info) {
    try {
      const sqlSelectQuery = `SELECT * FROM userinfo WHERE email = ? OR mobile_number = ?`;
      const details = await query(sqlSelectQuery, [
        info.emailAddress,
        info.mobileNumber,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for inserting user information
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async userRegistration(info) {
    try {
      const sqlInsertQuery = `
        INSERT INTO userinfo (
          full_name, blood_group, email, city, is_donor, is_available, mobile_number, user_password, covid_date
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`;
      const details = await query(sqlInsertQuery, [
        info.fullName,
        info.bloodGroup,
        info.emailAddress,
        info.city,
        info.isDonor,
        info.isAvailable,
        info.mobileNumber,
        info.userPassword,
        new Date(info.covidDate),
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for updating the user email verification
   * @param {*} req (email address)
   * @param {*} res (json with success/failure)
   */
  async verifyEmail(emailAddress) {
    try {
      const sqlUpdateQuery = `UPDATE ${databaseInitial}user SET isEmailVerified = 1 WHERE emailAddress = ?`;
      const details = await query(sqlUpdateQuery, [emailAddress]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for selecting user details for login
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async getUser(emailAddress) {
    try {
      const sqlSelectQuery = `
        SELECT id, full_name, blood_group, email, city, is_donor, is_available, 
          mobile_number, user_password, covid_date  
        FROM userinfo WHERE email = ?`;
      const details = await query(sqlSelectQuery, [emailAddress]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for selecting userpassword for changing password
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async getPassword(emailAddress) {
    try {
      const sqlSelectQuery = `SELECT userPassword FROM ${databaseInitial}user WHERE emailAddress = ?`;
      const details = await query(sqlSelectQuery, [emailAddress]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for updating userdetails
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async updateUser(emailAddress, info) {
    try {
      const sqlUpdateQuery = `
        UPDATE userinfo SET full_Name = ?, blood_group = ?, city = ?, 
        is_donor = ?, is_available = ?, mobile_number = ?, covid_date = ? 
        WHERE email = ?`;
      const details = await query(sqlUpdateQuery, [
        info.fullName,
        info.bloodGroup,
        info.city,
        info.isDonor,
        info.isAvailable,
        info.mobileNumber,
        new Date(info.covidDate),
        info.emailAddress,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for updating userdetails
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async addProfilePic(emailAddress, path) {
    try {
      const sqlUpdateQuery = `UPDATE ${databaseInitial}user SET profileURL = ? WHERE emailAddress = ?`;
      const details = await query(sqlUpdateQuery, [path, emailAddress]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for inserting requester information
   * @param {*} req (requester details)
   * @param {*} res (json with success/failure)
   */
  async addRequester(info) {
    try {
      const sqlInsertQuery = `
            INSERT INTO requester (
              full_name, blood_group, gender, age, city, mobile_number, remarks, date
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?
            )`;
      const details = await query(sqlInsertQuery, [
        info.fullName,
        info.bloodGroup,
        info.gender,
        +info.age,
        info.city,
        info.mobileNumber,
        info.remarks,
        new Date(info.date),
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for getting all pending requester
   * @param {*} req ()
   * @param {*} res (json with success/failure)
   */
  async getRequester() {
    try {
      const sqlSelectQuery = `
        SELECT * FROM requester WHERE is_completed = 0;
      `;
      const details = await query(sqlSelectQuery);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for updating requester
   * @param {*} req ()
   * @param {*} res (json with success/failure)
   */
  async updateRequester(requesterId) {
    try {
      const sqlUpdateQuery = `
          UPDATE requester SET is_completed = ? WHERE id = ?`;
      const details = await query(sqlUpdateQuery, [1, requesterId]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }
}

module.exports = {
  userDatabase: function () {
    return new UserDatabase();
  },
};

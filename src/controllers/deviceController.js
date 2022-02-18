import successResponse from "../utils/successResponse";
import errorResponse from "../utils/errorResponse";
import { HTTP_ERROR_CODE, HTTP_SUCCESS_CODE } from "../utils/constants";
import path from "path";
import moment from "moment";
import AWS from "aws-sdk";
import redisClient from "../cache/redisClient";

AWS.config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Errors = {
  default: {
    type: HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
    details: "Please contact the system administrator",
  },
  invalidToken: {
    type: HTTP_ERROR_CODE.NOT_FOUND,
    message: "Token not Found / Removed",
    details: "Please contact the system administrator",
  },
  sendDataError: {
    type: HTTP_ERROR_CODE.BAD_GATEWAY,
    message: "Error while sending data",
    details: "Please contact the system administrator",
  },
};

const Success = {
  fetchSuccess: {
    type: HTTP_SUCCESS_CODE.OK,
    message: "Data fetch success",
  },
  sendSuccess: {
    type: HTTP_SUCCESS_CODE.CREATED,
    message: "Data sent Successfully",
  },
  deleteSuccess: {
    type: HTTP_SUCCESS_CODE.OK,
    message: "User Deleted Successfully",
  },
};

const postData = async (req, res) => {
  try {
    const keys = await redisClient.hGetAll("iotKeys");

    if (!keys[`${req.key}`]) {
      throw Errors.invalidToken;
    } else {
      await redisClient.hSet("iotKeys", req.key, moment().utc().format());
    }

    var params = {
      MessageAttributes: {
        key: {
          DataType: "String",
          StringValue: req.key,
        },
        timestamp: {
          DataType: "String",
          StringValue: moment().toISOString(),
        },
      },
      MessageBody: JSON.stringify({
        ...req.body,
        reportedAt: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        key: req.key,
      }),
      QueueUrl: process.env.SQS_URL,
    };
    successResponse(Success.sendSuccess, "success", res);

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      error.type ? error : Errors.default,
      res,
      new Error().stack
    );
  }
};

export default {
  postData,
};

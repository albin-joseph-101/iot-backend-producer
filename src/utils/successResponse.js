import { SUCCESS_STATUS } from "./constants";

export const successResponse = async (successObj, data, res) => {
  res.status(SUCCESS_STATUS[successObj.type] || 200).send({ success: true, message: successObj.message, data });
};

export default successResponse;

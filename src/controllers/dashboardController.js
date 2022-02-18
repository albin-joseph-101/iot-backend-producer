import Keys from "../database/models/keys";
import successResponse from "../utils/successResponse";
import errorResponse from "../utils/errorResponse";
import { HTTP_ERROR_CODE, HTTP_SUCCESS_CODE } from '../utils/constants';
import path from 'path'
import { generateAPIToken } from '../utils/apiKeyProvider'
import errorLogData from "../database/models/errorLogData";
import keys from "../database/models/keys";
import deviceData from "../database/models/deviceData";
import errorDeviceData from "../database/models/errorDeviceData";

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Errors = {
    default: {
        type: HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        details: 'Please contact the system administrator',
    },
    noUser: {
        type: HTTP_ERROR_CODE.NOT_FOUND,
        message: 'No User found ',
        details: 'No User found ',
    },
};

const Success = {
    errorData: {
        type: HTTP_SUCCESS_CODE.OK,
        message: 'Error Data found',
    },
    fetchSuccess: {
        type: HTTP_SUCCESS_CODE.OK,
        message: 'Data fetch success',
    },
    createSuccess: {
        type: HTTP_SUCCESS_CODE.CREATED,
        message: 'Key Created Successfully',
    },
    deleteSuccess: {
        type: HTTP_SUCCESS_CODE.OK,
        message: 'Key Deleted Successfully',
    },
    dataUpdated: {
        type: HTTP_SUCCESS_CODE.OK,
        message: 'Data Updated Successfully',
    }
};

const createKey = async (req, res) => {
    const username = req.query.name;
    try {
        const key = await generateAPIToken()
        const newKey = await new Keys({
            username,
            key
        }).save()
        global.allKeys[`${newKey.key}`] = 1
        successResponse(Success.createSuccess, { key: newKey.key }, res)
    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const getAllKeys = async (req, res) => {

    try {

        const offset = req.query.offset || null;
        const limit = req.query.limit || null;

        const search = req.query.search ? {
            username: {
                $regex: req.query.search,
                $options: 'i'
            }
        } : {}

        const data = await Keys.find({ ...search }).limit(limit).skip(offset)
        const processedData = data.map(item => {
            return {
                id: item.id,
                name: item.username,
                key: item.key.substring(item.key.length - 6).replace(/\S(?=\S{4})/g, "*"),
                lastUsed: item.lastUsed,
                createdAt: item.createdAt
            }
        })

        successResponse(Success.fetchSuccess, processedData, res)
    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const deleteKey = async (req, res) => {
    try {
        const user = await Keys.findById(req.query.id)
        if (!user) throw Errors.noUser

        await Keys.findByIdAndRemove(req.query.id)
        successResponse(Success.deleteSuccess, "userDeleted", res)

    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const getKey = async (req, res) => {
    try {
        const data = await Keys.findById(req.query.id)
        if (!data) throw Errors.noUser

        successResponse(Success.fetchSuccess, data, res)
    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const getErrorLogData = async (req, res) => {
    console.log("object")
    try {

        const setLimit = req.query.limit ?
            [{ $skip: parseInt(req.query.offset) }, { $limit: parseInt(req.query.limit) }] : []

        const search = req.query.search ? {
            deviceId: {
                $regex: req.query.search,
                $options: 'i'
            }
        } : {}


        const data = await errorLogData.aggregate([

            {
                $match: { $and: [{ "status": { $eq: false } }, { ...search }] }
            },
            {
                $group: {
                    _id: "$deviceId",
                    body: { $first: "$body" },
                    key: { $first: "$key" },
                    deviceId: { $first: "$deviceId" },
                    status: { $first: "$status" },
                    reportedAt: { $first: "$reportedAt" }
                }
            },
            {
                $lookup: {
                    from: "keys", // collection name in db
                    localField: "key",
                    foreignField: "key",
                    as: "username"
                }
            },
            {
                $facet: {
                    paginatedResults: [...setLimit],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }

        ])

        successResponse(Success.errorData, data, res)

    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const toggleErrorStatus = async (req, res) => {
    const { id } = req.query
    try {
        const data = await keys.findById(id)
        const updated = await errorLogData.updateMany({ key: data.key }, { $set: { status: 1 } })
        successResponse(Success.dataUpdated, updated, res)

    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const getErrorDeviceData = async (req, res) => {
    
    try {
        const setLimit = req.query.limit ?
            [{ $skip: parseInt(req.query.offset) }, { $limit: parseInt(req.query.limit) }] : []

        const search = req.query.search ? {
            deviceId: {
                $regex: req.query.search,
                $options: 'i'
            }
        } : {}
        console.log(search)
        const data = await errorDeviceData.aggregate([

            {
                $match: { ...search }
            },
            {
                $lookup: {
                    from: "keys", // collection name in db
                    localField: "key",
                    foreignField: "key",
                    as: "username"
                }
            },
            {
                $facet: {
                    paginatedResults: [...setLimit],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }

        ])
        successResponse("error device data", data, res)

    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

const getDeviceData = async (req, res) => {

    try {
        const setLimit = req.query.limit ?
            [{ $skip: parseInt(req.query.offset) }, { $limit: parseInt(req.query.limit) }] : []

        const provider = //req.query.filters.manufacturer ? {
        {
            username: {
                $regex: "Emuron Dev",
                $options: 'i'
            }
        }
        //} : {}

        const search = req.query.search ? {
            deviceId: {
                $regex: req.query.search,
                $options: 'i'
            }
        } : {}

        // console.log(req.query.search)
        const data = await deviceData.aggregate([

            {
                $match: { ...search }
            },
            {
                $lookup: {
                    from: "keys", // collection name in db
                    localField: "key",
                    foreignField: "key",
                    as: "username",
                    // pipeline: [
                    //     {
                    //         // $match: { ...provider }
                    //     }
                    // ]
                }
            },
            {
                $facet: {
                    paginatedResults: [...setLimit],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }

        ])
        successResponse(Success.errorData, data, res)

    } catch (error) {
        console.log(error);
        return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
    }
}

export default {
    createKey,
    getAllKeys,
    deleteKey,
    getKey,
    getErrorLogData,
    toggleErrorStatus,
    getDeviceData,
    getErrorDeviceData
}
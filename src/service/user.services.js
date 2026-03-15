const user = require("../models/user.models");

const createUser = async (userData) => {
    try{
        const newUser = new user.User(userData);
        const result = await newUser.save();
        return result;
        
    } catch(err){
       throw new Error(err.message);
    }
}

const getAllUsers = async () =>{
    try{
        const result = await user.User.find({});
        return result;
    }catch(err){
        throw new Error(err.message);
    }
};

const getUSerById = async (id) =>{
    try{
        const result = await user.User.findById(id);
        return result;
    }catch(err){
        throw new Error(err.message);
    }
}

const updateUser = async (id, updateData) => {
    try{
        const result = await user.User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
        return result;
    }catch(err){
        throw new Error(err.message);
    }
};

const updateMultipleUsers = async (updates) => {
    try{

        const operations = updates.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $set: item.data }
            }
        }));

        const result = await user.User.bulkWrite(operations);

        return result;

    }catch(err){
        throw new Error(err.message);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUSerById,
    updateUser,
    updateMultipleUsers
};
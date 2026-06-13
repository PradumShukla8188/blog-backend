const {Roles} = require('../constants/roles');
const {RoleModel} = require('../databaseModels/role');

async function createRoles() {
    try{
        for(const roleKey in Roles){
            let r = await RoleModel.findOne({name: Roles[roleKey].name});
            if(!r){
                await RoleModel.create({name: Roles[roleKey].name, displayValue: Roles[roleKey].displayValue});
            }
        }
        return 'Roles created successfully.';
}catch(err){
    console.error('Error creating roles:', err);
    return Promise.reject(err);
}
}

module.exports = {createRoles};
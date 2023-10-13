const roleService = require('@/services/role.service')
const Redis = require('ioredis')

const redisClient = new Redis()

 async function init() {
    const data = await roleService.listRole()
    data.data.map((role) => {
        redisClient.set(role._id, JSON.stringify(role))
    })
}
init()

module.exports = redisClient


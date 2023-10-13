import redisClient from "@/middlewares/redis";

// redisClient.lRange("online_users", 0, -1).then((res) => {
//     console.log("res:: ", res);
// });

// const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const onlineUsersKey = "online_users";

const addUserToOnlineList = async (user) => {
  // Add the user to the online users list in Redis
  try {
    console.log("Add the user to the online users list in Redis");
    const res = await redisClient.lPush(onlineUsersKey, JSON.stringify(user));
    console.log("res::", res);
  } catch (error) {
    console.log("error::", error);
  }
};

const removeUserById = async (userId) => {
  // Find the user with the matching socketId and remove from Redis
  console.log("removing");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);

        // Check if "b" is equal to userId
        if (parsedElement.userId === userId) {
          // Remove the item from the list
          redisClient
            .lRem(onlineUsersKey, 0, element)
            .then((res) => {
              console.log("success");
            })
            .catch((err) => console.log("err:: ", err));
        }
      });
    })
    .catch((err) => console.log("err:: ", err));
};

const removeUserBySocketId = async (socketId) => {
  // Find the user with the matching socketId and remove from Redis
  console.log("removing");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);

        // Check if "b" is equal to socketId
        if (parsedElement.socketId === socketId) {
          // Remove the item from the list
          redisClient
            .lRem(onlineUsersKey, 0, element)
            .then((res) => {
              console.log("success");
            })
            .catch((err) => console.log("err:: ", err));
        }
      });
    })
    .catch((err) => console.log("err:: ", err));
};

const checkIfUserIsOnline = async (userId) => {
  // Find the user with the matching userId
  console.log("checking user is online");
  let socketId = 0;

  await redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);
        console.log("test", userId, parsedElement.userId);
        // Check if "b" is equal to socketId
        if (parsedElement.userId === userId) {
          socketId = parsedElement.socketId;
        }
        console.log("socket:: ", socketId);
      });
      return socketId;
    })
    .catch((err) => console.log("err:: ", err));
  return socketId;
};

const getOnlineUsers = async () => {
  // Find the user with the matching userId
  console.log("getting online users");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((res) => {
      console.log("res:: ", res);
      return res;
    })
    .catch((error) => {
      console.log("error:: ", error);
    });
};

module.exports = {
  addUserToOnlineList,
  getOnlineUsers,
  removeUserById,
  removeUserBySocketId,
  checkIfUserIsOnline,
};

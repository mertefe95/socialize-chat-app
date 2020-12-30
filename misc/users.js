const users = [];

function userJoined(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getTheCurrentUser(id) {
  return users.find(user => user.id === id);
}

function userLeft(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getTheRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoined,
  getTheCurrentUser,
  userLeft,
  getTheRoomUsers
};

const User = require('../models/User');

const resolvers = {

  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
    updateUser: async (_, { id, name, email }) => {
      const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findOneAndDelete(id);
      return user;
    },
  }

};

module.exports = { resolvers };
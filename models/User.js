const createModel = require('./createModel');

const userSchema = {
  name: {
    type: String,
    required: true,
  }, email: {
    type: String,
    required: true,
    unique: true,
  }, gender: {
    type: String,
    required: true,
    enum: ['FEMALE', 'MALE', 'OTHER'],
    default: 'OTHER'
  }
}

module.exports = createModel('User', userSchema);
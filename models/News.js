const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const NewsSchema = new mongoose.Schema({
  headLine: { type: String },
  description: { type: String },
  link: { type: String },
  category: [{ type: String }],
  date: [{ type: String }],
  tags: [{ type: String }],
});
NewsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('News', NewsSchema);

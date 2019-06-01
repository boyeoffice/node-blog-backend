const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blog_node_app', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
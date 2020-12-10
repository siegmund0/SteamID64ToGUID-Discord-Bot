const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
    Arma3Ip: {
        type: String
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('arma3ip', PrefixSchema);
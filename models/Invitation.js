const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    name: {
        type: String,
    },
    status: {
        type: Number,
        default: -1,
    },
    respondedIPs: [{
        ip: String,
        name: String,
        status: Number
    }]
});

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
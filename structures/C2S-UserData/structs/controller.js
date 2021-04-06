'use strict';

const mongoose = require('mongoose'),
    UserData = mongoose.model('UserData'),
    { c2sGuildID } = require('../../../config');

exports.list_userdata = function(req, res) {
  UserData.find({}, function(err, entry) {
    if (err) return res.send(err);
    res.status(200).json(entry);
  });
};


exports.write_userdata = function(req, res) {
  const new_entry = new UserData(req.body);
  new_entry.save(function(err, entry) {
    if (err) return res.send(err);
    res.status(200).json(entry);
  });
};


exports.read_userdata = function(req, res) {
  UserData.findOne({ playerId: req.params.playerId, playerToken: req.body.playerToken }, function(err, entry) {
    if (err) return res.send(err);
    res.status(200).json(entry);
  });
};


exports.update_userdata = function(req, res) {
  UserData.findOneAndUpdate({ playerId: req.params.playerId, playerToken: req.body.playerToken }, { metabits: req.body.metabits, edited_timestamp: Date.now() }, {new: true}, async function(err, entry) {
    if (err) return res.send(err);
    if (req.body.metabits >= 1E9 && !!entry) {
        const member = await req.client.guilds.cache.get(c2sGuildID).members.fetch(entry.discordId);
        if (member.roles.cache.has('499316778426433538')) console.log(`${member.user.tag} has reached the Reality Expert requirement but already has the role.`);
        else member.roles.add('499316778426433538')
          .then(member => {
            console.log(`Successfully given the reality expert role to ${member.user.tag}`);
            member.user.send(`You have successfully received the Reality Expert role, congrats!`);
          });
    }
    res.status(200).json(entry);
  });
};


exports.delete_userdata = function(req, res) {
  UserData.findOneAndDelete({ 
    playerId: req.params.playerId,
    playerToken: req.body.playerToken
  }, function(err, entry) {
    if (err) return res.send(err);
    res.status(200).json({ message: 'User Data successfully deleted', discordId: entry.discordId });
  });
};
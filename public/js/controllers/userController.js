module.exports = {
   getUser: function(req,res) {
     return res.send(req.user);
};

// Middelware ===================================================================
function notFound(req, res) {
  res.send(404);
}


// Exports ======================================================================
module.exports = {
  notFound: notFound
};

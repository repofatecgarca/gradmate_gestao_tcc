const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.cookie.token = null;
    res.cookie.permissions = null;
    res.redirect("/login");
});

module.exports = {
    router
}
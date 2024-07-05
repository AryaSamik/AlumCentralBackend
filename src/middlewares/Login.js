const isLoggedIn = (req, res, next) => {
    try{
        if(!req.cookies.jwt){
            next();
        } else {
            res.json({
                message: 'A user is already Logged in'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(err.status).json({message: "Internal Server Error"});
    }
}

const isLoggedOut = (req, res, next) => {
    try{
        if(req.cookies.jwt){
            next();
        } else {
            res.json({
                message: 'Already Logged out'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(err.status).json({message: "Internal Server Error"});
    }
}

module.exports = {isLoggedIn, isLoggedOut};
const AdminAuth = (req, res, next)=>{
    console.log("Admin Auth is getting checked");
    const token = "xyz";
    const isadminauthorized = token === "xoyz";
    if(!isadminauthorized){
        res.status(401).send("Unauthorized access");
    }else{
        next();
    }
}
const UserAuth = (req, res, next)=>{
    console.log("Admin Auth is getting checked");
    const token = "boyz";
    const isadminauthorized = token === "boyz";
    if(!isadminauthorized){
        res.status(401).send("Unauthorized access");
    }else{
        next();
    }
}
module.exports = {
    AdminAuth,
    UserAuth
}
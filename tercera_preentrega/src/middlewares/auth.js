import jwt from 'jsonwebtoken'

export const checkRole = (roles)=>{
    return (req,res,next)=>{

        const tokenInfo = req.cookies["jwt-cookie"];

        const decodedToken = jwt.decode(tokenInfo);

        if(!decodedToken){
            return res.status(404).json({
                status:"error", 
                message:"necesitas inciar sesion"
            });
        }
        if(!roles.includes(decodedToken.rol)){
            return res.status(401).json({
                status:"error", 
                message:"no tenes los permisos necesarios para entrar"});
        }
        next();
    }
}
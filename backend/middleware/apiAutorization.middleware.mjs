// export default async function restrict(allowedRoles) {
export class AuthorizationMiddleware {

   static  restrict(allowedRoles) {
    return (req, res, next) => {
      
      if (
        req.apiUser &&
        allowedRoles.includes(req.apiUser.role)
      ) {
        next(); 
      } else {
       
        res.status(403).json({
          status: "Access Denied",
          message: "You do not have permission to view this page.",
        });
      }
    };
  }

}
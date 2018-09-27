import BaseError from "./error";
import * as _ from 'lodash';

const INVALID_REQUEST:string = "Invalid request";

module Validators{
    
    export module Event{
        export function validate(req, res, next):boolean{
            debugger;
            let body = Array.isArray(req.body) ? req.body[0] : req.body;
            const missingProps = [];
            
            if(body == null){
                return next(new BaseError(401, `${INVALID_REQUEST}, event data is missing`));
            }

            _.isEmpty(body.area) && missingProps.push('area');
            _.isEmpty(body.name) && missingProps.push('name');
            _.isEmpty(body.actorId) && missingProps.push('actorId');
            _.isEmpty(body.actorName) && missingProps.push('actorName');
            _.isEmpty(body.title) && missingProps.push('title');
            _.isEmpty(body.body) && missingProps.push('body');
            _.isEmpty(body.entityId) && missingProps.push('entityId');

            if(missingProps.length > 0){
                const errMessage = `${INVALID_REQUEST}. Properties(${missingProps.join(', ')}) can't be empty`;
                res.status(400).json({err: errMessage});
                return next(new BaseError(400, errMessage));
            }

            next();
        }
    }

}

export default Validators;
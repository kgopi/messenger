import sgMail = require('@sendgrid/mail');
import {config} from './../../config';

module EmailServices{

    export function send(msg:{to:string, from:string, subject:string, html:string, test?:string}){
        sgMail.setApiKey(config.sendGridApiKey);
        sgMail.send(msg);
    }

}

export default EmailServices;
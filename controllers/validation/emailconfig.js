const nodemailer = require("nodemailer");
export class emailConfig {
 
    async config(){
        var config = nodemailer.createTransport({
            host: `${process.env.EMAILHOST}`,
            port: `${process.env.EMAILPORT}`,
            secure: true, // true for 465, false for other ports
            auth: {
            user: `${process.env.EMAILUSER}`, // generated ethereal user
            pass: `${process.env.EMAILPASS}` // generated ethereal password
            }
        });
        return config;
    }
}
export default new emailConfig();
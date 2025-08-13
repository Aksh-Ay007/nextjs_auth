import nodemailer from 'nodemailer';

import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VARIFY") {
            await User.findByIdAndUpdate(userId, {
                varifyToken: hashedToken,
                varifyTokenExpiry: Date.now() + 3600000
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: Date.now() + 3600000
            });
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });

     const mailOptions = {
    from: 'akshayjyothip@gmail.com',
    to: email,
    subject: emailType === "VARIFY" ? "Verify Your Account" : "Reset Your Password",
    html: `<p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
        ${emailType === "VARIFY" ? "verify your email" : "reset your password"}<br>
        Or copy and paste the link below in your browser:<br>
        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    </p>`
};

        const mailResponse = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse.response);
        return mailResponse;
    } catch (error: any) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
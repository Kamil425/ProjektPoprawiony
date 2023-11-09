import mongoose from "mongoose";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/mongodb";
import cron from "node-cron";
import nodemailer from "nodemailer";

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'quizgrad@outlook.com', 
        pass: 'WojtekKojtek!#' 
    },
    pool: true, // Enable connection pooling
    maxConnections: 3, // Limit the number of concurrent connections to 3
 } as nodemailer.TransportOptions);
 

async function sendNotification(email:any, message:any) {
    // Email sending options
    const mailOptions = {
        from: 'quizgrad@outlook.com', 
        to: email, 
        subject: 'Brak Aktywności na platformie QuizGrad', 
        text: message 
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent to: ${email}`);
    } catch (error) {
        console.error("Error sending email notification:", error);
    }
}
export async function checkInactiveUsersAndSendNotifications() {
    try {
        await connectMongoDB();
        console.log("Checking for inactive users...");
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calculate date one week ago

        const inactiveUsers = await User.find({
            OstatniaAktywnosc: { $lte: oneWeekAgo },
            $or: [
                { powiadomieniaWyslane: { $exists: false } },
                { powiadomieniaWyslane: { $lt: 4 } },
            ],
        });

        for (const user of inactiveUsers) {
            if (!user.name) {
                console.log(`User with missing name - Email: ${user.email}`);
            }

            await sendNotification(user.email, "Hej, tu QuizGrad!. Dawno cię nie widzieliśmy. Mamy nadzieje, że o nas nie zapomniałeś! Zaloguj się na swoje konto, aby kontynuować naukę.");
            console.log(`Email notification sent to ${user.email}`);
            
            if (!user.powiadomieniaWyslane || user.powiadomieniaWyslane < 4) {
                user.powiadomieniaWyslane = (user.powiadomieniaWyslane || 0) + 1;
                await user.save();
                console.log(`Notification sent for email sent to ${user.email}`);
            } else {
                console.log(`No update needed for ${user.email}`);
            }
        }

        console.log("Notification check complete.");
    } catch (error) {
        console.error("Error in sending notifications:", error);
    }
}

// Adjust the cron schedule to run every 10 seconds
cron.schedule("0 * * * *", async () => {
    await checkInactiveUsersAndSendNotifications();
});

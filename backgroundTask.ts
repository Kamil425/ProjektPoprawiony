import cron from "node-cron";
import { checkInactiveUsersAndSendNotifications } from "./app/NotificationService/page";


cron.schedule("0 * * * *", async () => {
  await checkInactiveUsersAndSendNotifications();
});



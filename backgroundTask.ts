import cron from "node-cron";
import { checkInactiveUsersAndSendNotifications } from "./app/NotificationService/page";

cron.schedule("*/10 * * * * *", async () => {
  await checkInactiveUsersAndSendNotifications();
});
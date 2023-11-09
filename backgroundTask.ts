import cron from "node-cron";
import { checkInactiveUsersAndSendNotifications } from "./app/NotificationService/page";

<<<<<<< Updated upstream
cron.schedule("0 * * * *", async () => {
  await checkInactiveUsersAndSendNotifications();
});
=======

cron.schedule("*/10 * * * * *", async () => {
  await checkInactiveUsersAndSendNotifications();
});


>>>>>>> Stashed changes

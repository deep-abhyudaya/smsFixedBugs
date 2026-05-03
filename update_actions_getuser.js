const fs = require('fs');
let data = fs.readFileSync('src/lib/actions.ts', 'utf8');

const replacementStr = `    let username = "unknown";
    try {
      if (userId) {
        const user = await clerkClient.users.getUser(userId);
        if (user && user.username) username = user.username;
      }
    } catch (e) {
      console.log("Could not fetch user from Clerk, using unknown username");
    }`;

data = data.replace(/const user = await clerkClient\.users\.getUser\(userId \|\| ""\);\s*const username = user\.username \|\| "unknown";/g, replacementStr);

fs.writeFileSync('src/lib/actions.ts', data);

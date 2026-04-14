import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "db.json");

function ensurePhones() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.users)) {
    console.error("db.json has no users array");
    process.exit(1);
  }
  let changed = false;
  data.users = data.users.map((u) => {
    if (!Object.prototype.hasOwnProperty.call(u, "phone")) {
      changed = true;
      return { ...u, phone: "" };
    }
    return u;
  });
  if (changed) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Updated db.json: added missing phone fields to users.");
  } else {
    console.log("No changes: all users already have phone field.");
  }
}

ensurePhones();

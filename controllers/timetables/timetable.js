import database from "../../database/connection.js";
import moment from "moment"; //use moment.js to manage dates easily

// Helper function to shuffle an array (used to randomize shifts)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Timetable = {
  generateTimetable: async (weekStart, weekEnd) => {
    // 1. Get all HOs (users with the role 'HO')
    const hoUsers = await database.query(
      "SELECT user_id FROM users WHERE role = $1",
      ["HO"]
    );
    const hos = hoUsers.rows; // `rows` contains all the doctors with role 'HO'

    // 2. Get all wards (departments in the hospital)
    const wards = await database.query("SELECT ward_id FROM wards");
    const wardList = wards.rows; // `rows` contains all wards

    // 3. Initialize a daily tracker for PM shifts in each ward
    const pmWardTracker = {}; // This will track PM shifts for each ward for each day
    for (let ward of wardList) {
      pmWardTracker[ward.ward_id] = Array(7).fill(0); // 7 days, initially 0 PM shifts
    }

    // 4. For each HO, assign random shifts following the rules (2 AM, 2 PM, 1 Night, 2 Off)
    for (let ho of hos) {
      const userId = ho.user_id; // Each doctor has a user ID
      let shifts = ["AM", "AM", "PM", "PM", "Night", "Off", "Off"]; // Create the shift array

      // Randomly shuffle the shifts
      shifts = shuffleArray(shifts);

      // Loop through each day of the week (7 days total)
      for (let i = 0; i < 7; i++) {
        const currentDay = moment(weekStart)
          .add(i, "days")
          .format("YYYY-MM-DD");
        const shiftType = shifts[i]; // Get the shift for this day

        // Randomly assign the HO to a ward
        const randomWard =
          wardList[Math.floor(Math.random() * wardList.length)].ward_id;

        // If the shift is PM, track it in the pmWardTracker
        if (shiftType === "PM") {
          pmWardTracker[randomWard][i] += 1;
        }

        // Insert the generated shift into the database
        await database.query(
          "INSERT INTO shifts (user_id, ward_id, shift_type, date) VALUES ($1, $2, $3, $4)",
          [userId, randomWard, shiftType, currentDay]
        );
      }
    }

    // 5. Now ensure that every ward has at least 1 PM shift per day
    for (let i = 0; i < 7; i++) {
      // Loop through each day
      for (let ward of wardList) {
        const wardId = ward.ward_id;
        if (pmWardTracker[wardId][i] === 0) {
          // No PM HO assigned to this ward on this day
          // Find a random HO who has a shift other than PM on this day and swap
          const hoToSwap = await database.query(
            `SELECT shift_id, user_id FROM shifts WHERE ward_id = $1 AND date = $2 AND shift_type != 'PM' LIMIT 1`,
            [wardId, moment(weekStart).add(i, "days").format("YYYY-MM-DD")]
          );

          if (hoToSwap.rows.length > 0) {
            const { shift_id, user_id } = hoToSwap.rows[0];

            // Update this HO's shift to 'PM'
            await database.query(
              "UPDATE shifts SET shift_type = $1 WHERE shift_id = $2",
              ["PM", shift_id]
            );

            // Track that we now have a PM HO for this ward on this day
            pmWardTracker[wardId][i] += 1;
          }
        }
      }
    }

    // 6. Return a message when the timetable is generated successfully
    return { message: "Timetable generated successfully" };
  },
};

export default Timetable;

//*INITIAL CODE*
// const Timetable = {
//   generateTimetable: async (weekStart, weekEnd) => {
//     // 1. Get all HOs (users with the role 'HO')
//     const hoUsers = await database.query(
//       "SELECT user_id FROM users WHERE role = $1",
//       ["HO"]
//     );
//     const hos = hoUsers.rows; // `rows` contains all the doctors with role 'HO'

//     // 2. Get all wards
//     const wards = await database.query("SELECT ward_id FROM wards");
//     const wardList = wards.rows; // `rows` contains all wards

//     // 3. Define the types of shifts
//     const shifts = ["AM", "PM", "Night", "Off"];

//     // 4. Now, for each HO, assign shifts for each day of the week
//     for (let ho of hos) {
//       const userId = ho.user_id; // Each doctor has a user ID

//       // Loop through each day of the week (7 days total)
//       for (let i = 0; i < 7; i++) {
//         // Get the current day by adding `i` days to the start of the week
//         const currentDay = moment(weekStart)
//           .add(i, "days")
//           .format("YYYY-MM-DD");
//         let shiftType;

//         // 5. Assign shifts based on the rules (2 AM, 2 PM, 1 Night, 1 Off)
//         if (i < 2) shiftType = "AM"; // First 2 days: AM shifts
//         else if (i < 4) shiftType = "PM"; // Next 2 days: PM shifts
//         else if (i < 5) shiftType = "Night"; // Next 1 day: Night shift
//         else shiftType = "Off"; // Last 2 days: Off

//         // 6. Randomly assign the HO to a ward (or choose based on business rules)
//         const randomWard =
//           wardList[Math.floor(Math.random() * wardList.length)].ward_id;

//         // 7. Insert the generated shift into the database
//         await database.query(
//           "INSERT INTO shifts (user_id, ward_id, shift_type, date) VALUES ($1, $2, $3, $4)",
//           [userId, randomWard, shiftType, currentDay]
//         );
//       }
//     }

//     // 8. Return a message when the timetable is generated successfully
//     return { message: "Timetable generated successfully" };
//   },
// };

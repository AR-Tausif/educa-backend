// Function to calculate due amount
// export function calculateDueAmount(student, academic) {
//   const result = {};
//   Object.keys(academic).forEach((key) => {
//     console.log(key);
//     if (
//       key !== "_id" &&
//       key !== "class" &&
//       key !== "year" &&
//       key !== "createdBy" &&
//       key !== "__v"
//     ) {
//       const studentAmount = student[key]?.amount || 0;
//       const academicAmount = academic[key] || 0;
//       const dueAmount = academicAmount - studentAmount;
//       result[key] = dueAmount;
//     }
//   });
//   return result;
// }

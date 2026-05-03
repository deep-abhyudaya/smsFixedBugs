const fs = require('fs');
let data = fs.readFileSync('src/lib/actions.ts', 'utf8');

const studentTarget = /await clerkClient\.users\.deleteUser\(id\);\s*await prisma\.student\.delete\(\{/;

const studentReplacement = `try {
      await clerkClient.users.deleteUser(id);
    } catch (e) {
      console.log("Clerk user not found, proceeding with db deletion");
    }

    // Manual cascade deletion for related records
    await prisma.attendance.deleteMany({ where: { studentId: id } });
    await prisma.result.deleteMany({ where: { studentId: id } });
    await prisma.courseEnrollment.deleteMany({ where: { studentId: id } });
    await prisma.courseProgress.deleteMany({ where: { studentId: id } });
    await prisma.courseReview.deleteMany({ where: { studentId: id } });
    await prisma.ticket.deleteMany({ where: { studentId: id } });
    await prisma.notification.deleteMany({ where: { studentId: id } });

    await prisma.student.delete({`;

data = data.replace(studentTarget, studentReplacement);

const parentTarget = /await clerkClient\.users\.deleteUser\(id\);\s*await prisma\.parent\.delete\(\{ where: \{ id \} \}\);/;

const parentReplacement = `try {
      await clerkClient.users.deleteUser(id);
    } catch (e) {
      console.log("Clerk user not found, proceeding with db deletion");
    }

    // Manual cascade deletion for related records
    // Students must be handled first because parentId is required
    const students = await prisma.student.findMany({ where: { parentId: id }, select: { id: true } });
    for (const student of students) {
      const sId = student.id;
      try { await clerkClient.users.deleteUser(sId); } catch(e) {}
      await prisma.attendance.deleteMany({ where: { studentId: sId } });
      await prisma.result.deleteMany({ where: { studentId: sId } });
      await prisma.courseEnrollment.deleteMany({ where: { studentId: sId } });
      await prisma.courseProgress.deleteMany({ where: { studentId: sId } });
      await prisma.courseReview.deleteMany({ where: { studentId: sId } });
      await prisma.ticket.deleteMany({ where: { studentId: sId } });
      await prisma.notification.deleteMany({ where: { studentId: sId } });
      await prisma.student.delete({ where: { id: sId } });
    }

    await prisma.ticket.deleteMany({ where: { parentId: id } });
    await prisma.notification.deleteMany({ where: { parentId: id } });

    await prisma.parent.delete({ where: { id } });`;

data = data.replace(parentTarget, parentReplacement);

const teacherTarget = /await clerkClient\.users\.deleteUser\(id\);\s*await prisma\.teacher\.delete\(\{/;

const teacherReplacement = `try {
      await clerkClient.users.deleteUser(id);
    } catch (e) {
      console.log("Clerk user not found, proceeding with db deletion");
    }

    await prisma.teacher.delete({`;

data = data.replace(teacherTarget, teacherReplacement);

fs.writeFileSync('src/lib/actions.ts', data);

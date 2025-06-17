import passport from "passport";
import { Student } from "../models/student.js";
import { Teacher } from "../models/teacher.js";

// Register Student strategy
passport.use('student', Student.createStrategy());
// Register Teacher strategy
passport.use('teacher', Teacher.createStrategy());

// Serialize/deserialize for session support
passport.serializeUser((user, done) => {
    // You can add a custom property to distinguish user type if needed
    done(null, { id: user.id, type: user instanceof Student ? 'student' : 'teacher' });
});

passport.deserializeUser(async (obj, done) => {
    try {
        if (obj.type === 'student') {
            const user = await Student.findById(obj.id);
            done(null, user);
        } else {
            const user = await Teacher.findById(obj.id);
            done(null, user);
        }
    } catch (err) {
        done(err);
    }
});

export default passport;
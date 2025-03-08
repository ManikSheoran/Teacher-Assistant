import React from "react";

export default function AboutComponent() {
    return (
        <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
            {/* Challenge Section */}
            <section className="mb-12 bg-[#F9E9EC] dark:bg-[#1D2F6F] rounded-lg shadow-lg p-6">
                <h2 className="text-4xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-4">
                    The Challenge: Overburdened Educators & Limited Personalized
                    Feedback
                </h2>
                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] opacity-80 mb-6">
                    Teachers in schools, coaching centers, and colleges are
                    overwhelmed with grading assignments and providing
                    individual feedback—especially in large classrooms where the
                    teacher-to-student ratio is high.
                </p>

                <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Time-Consuming Manual Grading
                            </span>{" "}
                            – Hours spent on repetitive evaluation leave little
                            time for mentoring.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Lack of Personalized Feedback
                            </span>{" "}
                            – Students don't receive timely, tailored insights
                            on their progress.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Under-Resourced Classrooms
                            </span>{" "}
                            – High workloads make it difficult to support every
                            student effectively.
                        </span>
                    </li>
                </ul>

                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] italic border-l-4 border-[#F88DAD] pl-4">
                    Without efficient grading systems, students miss out on the
                    personalized guidance they need to grow academically,
                    leading to widening learning gaps.
                </p>
            </section>

            {/* Solution Section */}
            <section className="mb-12 bg-[#F9E9EC] dark:bg-[#1D2F6F] rounded-lg shadow-lg p-6">
                <h2 className="text-4xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-4">
                    The Solution: AI-Powered Teacher Assistant
                </h2>
                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] opacity-80 mb-6">
                    To solve this challenge, NeuroGrade introduces an AI-driven
                    grading and feedback system that:
                </p>

                <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Automates Assignment Evaluation
                            </span>{" "}
                            – Instantly assesses responses, saving teachers
                            valuable time.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Delivers Personalized Feedback
                            </span>{" "}
                            – AI-generated insights help students understand
                            their strengths & weaknesses.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Enhances Teaching Efficiency
                            </span>{" "}
                            – Educators can focus more on mentoring instead of
                            grading.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            <span className="font-semibold">
                                Supports Inclusive Learning
                            </span>{" "}
                            – AI adapts feedback for diverse student needs,
                            ensuring no learner is left behind.
                        </span>
                    </li>
                </ul>

                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] italic border-l-4 border-[#8390FA] pl-4">
                    With AI-powered automation, teachers can provide
                    higher-quality feedback faster, ensuring students receive
                    timely, actionable insights for academic improvement.
                </p>
            </section>

            {/* SDG Section */}
            <section className="bg-[#F9E9EC] dark:bg-[#1D2F6F] rounded-lg shadow-lg p-6">
                <h2 className="text-4xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-4">
                    Aligning with UN SDG 4: Quality Education
                </h2>
                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] opacity-80 mb-6">
                    NeuroGrade is designed to support United Nations Sustainable
                    Development Goal 4 (Quality Education) by:
                </p>

                <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            Reducing barriers to personalized learning through
                            AI-driven insights.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            Ensuring equitable access to quality education for
                            students in high-ratio classrooms.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#1D2F6F] dark:text-[#F9E9EC]">
                            Empowering educators with smart tools that improve
                            teaching effectiveness.
                        </span>
                    </li>
                </ul>

                <p className="text-xl text-[#1D2F6F] dark:text-[#F9E9EC] italic border-l-4 border-[#FAC748] pl-4">
                    By integrating AI into education, we move towards a future
                    where every student receives the guidance they need to
                    excel—regardless of classroom size or resources.
                </p>
            </section>
        </div>
    );
}

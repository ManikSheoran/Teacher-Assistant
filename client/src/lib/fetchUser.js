const fetchUser = async () => {
    // Try student endpoint first
    let res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/student/data`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }
    );
    if (res.ok) return await res.json();

    // If not student, try teacher endpoint
    res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/teacher/data`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }
    );
    if (res.ok) return await res.json();

    // If neither, return null
    return null;
};

export default fetchUser;
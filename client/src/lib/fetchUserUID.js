const fetchUserUID = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/validate`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }
    );
    return res.ok;
};

export default fetchUserUID;

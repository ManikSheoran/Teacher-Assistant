const fetchUserUID = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/fetchuid`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }
    );
    return await res.json();
};

export default fetchUserUID;

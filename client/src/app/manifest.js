export default function manifest() {
    return {
        name: "NeuroGrade",
        short_name: "NeuroGrade",
        description: "A simple web app to help teachers grade students.",
        start_url: "/",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}

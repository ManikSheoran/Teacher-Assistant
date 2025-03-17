import React, { useEffect, useRef } from "react";

const Background = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;
        let gradientAngle = 0;
        let frameCount = 0;

        // Calculate appropriate particle count based on screen size
        const getParticleCount = () => {
            const area = window.innerWidth * window.innerHeight;
            const baseCount = Math.floor(area / 15000); // 1 particle per 15000px²
            return Math.min(Math.max(baseCount, 40), 100); // Between 40 and 100
        };

        // Handle device pixel ratio for crisp rendering on high-DPI devices
        const resizeCanvas = () => {
            // Get the device pixel ratio
            const dpr = window.devicePixelRatio || 1;

            // Get display size - add 2 pixels to eliminate the white line
            const displayWidth = window.innerWidth + 2;
            const displayHeight = window.innerHeight + 2;

            // Set canvas size accounting for device pixel ratio
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            // Scale all drawing operations by the dpr
            ctx.scale(dpr, dpr);

            // Set CSS size - make it slightly larger to cover any potential gaps
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            // Adjust particle count on resize
            adjustParticles();
        };

        const createGradient = () => {
            const gradient = ctx.createLinearGradient(
                0,
                0,
                window.innerWidth * Math.cos(gradientAngle),
                window.innerHeight * Math.sin(gradientAngle)
            );

            // Get theme colors
            const isDarkMode = document.body.classList.contains("dark-mode");
            const color1 = isDarkMode ? "#1a1a2e" : "#e3f2fd";
            const color2 = isDarkMode ? "#16213e" : "#bbdefb";

            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        };

        class Particle {
            constructor(isNew = false) {
                if (isNew) {
                    // Randomly choose which edge to spawn from
                    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

                    if (edge === 0) {
                        // top
                        this.x = Math.random() * window.innerWidth;
                        this.y = -10;
                    } else if (edge === 1) {
                        // right
                        this.x = window.innerWidth + 10;
                        this.y = Math.random() * window.innerHeight;
                    } else if (edge === 2) {
                        // bottom
                        this.x = Math.random() * window.innerWidth;
                        this.y = window.innerHeight + 10;
                    } else {
                        // left
                        this.x = -10;
                        this.y = Math.random() * window.innerHeight;
                    }

                    // Random velocity for new particles
                    const angle = Math.random() * Math.PI * 2; // Random angle
                    const speed = 0.2 + Math.random() * 0.3; // Random speed
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                } else {
                    // Initially place particles randomly across the entire screen
                    this.x = Math.random() * window.innerWidth;
                    this.y = Math.random() * window.innerHeight;
                    // Use fixed values for velocity but ensure more randomness
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.1 + Math.random() * 0.4;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                }

                this.radius = 2;
            }

            update() {
                // Add slight randomness to movement
                if (Math.random() < 0.05) {
                    this.vx += (Math.random() - 0.5) * 0.02;
                    this.vy += (Math.random() - 0.5) * 0.02;
                }

                // Limit max speed
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 0.8) {
                    this.vx = (this.vx / speed) * 0.8;
                    this.vy = (this.vy / speed) * 0.8;
                }

                // Update position
                this.x += this.vx;
                this.y += this.vy;
            }

            isOffScreen() {
                return (
                    this.x < -10 ||
                    this.x > window.innerWidth + 10 ||
                    this.y < -10 ||
                    this.y > window.innerHeight + 10
                );
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

                // Use the requested colors
                const isDarkMode =
                    document.body.classList.contains("dark-mode");
                const color = isDarkMode ? "#8390FA" : "#1D2F6F";
                ctx.fillStyle = color;

                ctx.fill();
                ctx.closePath();
            }
        }

        const createInitialParticles = () => {
            particles = [];
            const particleCount = getParticleCount();

            // Create particles with good distribution
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        // Add new particles from different edges
        const addNewParticles = () => {
            const desiredCount = getParticleCount();
            const currentCount = particles.length;

            // Only add new particles if we're below the desired count
            if (currentCount < desiredCount) {
                // Calculate how many to add - add gradually to avoid sudden appearance
                const numberToAdd = Math.min(desiredCount - currentCount, 2);

                for (let i = 0; i < numberToAdd; i++) {
                    particles.push(new Particle(true));
                }
            }
        };

        // Adjust particle count when screen size changes
        const adjustParticles = () => {
            createInitialParticles();
        };

        const drawConnections = () => {
            const maxDistance = 100;

            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach((p2) => {
                    const distance = Math.sqrt(
                        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
                    );
                    if (distance < maxDistance) {
                        ctx.beginPath();
                        const alpha = 1 - distance / maxDistance;
                        const isDarkMode =
                            document.body.classList.contains("dark-mode");

                        // Match connection color with particle color but with transparency
                        ctx.strokeStyle = isDarkMode
                            ? `rgba(131, 144, 250, ${alpha * 0.6})` // #8390FA with alpha
                            : `rgba(29, 47, 111, ${alpha * 0.4})`; // #1D2F6F with alpha

                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                });
            });
        };

        const animate = () => {
            // Update gradient angle
            gradientAngle += 0.002;
            if (gradientAngle >= Math.PI * 2) {
                gradientAngle = 0;
            }

            // Fill background with gradient
            ctx.fillStyle = createGradient();
            ctx.fillRect(0, 0, window.innerWidth + 2, window.innerHeight + 2);

            // Count frames for controlled particle generation
            frameCount++;

            // Add new particles at a controlled rate
            if (frameCount % 30 === 0) {
                addNewParticles();
            }

            // Update and draw particles, remove off-screen ones
            particles = particles.filter((particle) => {
                particle.update();
                particle.draw();
                return !particle.isOffScreen();
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animate);
        };

        // Debounce resize handler
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 250);
        };

        window.addEventListener("resize", handleResize);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1,
                width: "100vw",
                height: "100vh",
                display: "block",
                margin: 0,
                padding: 0,
            }}
        />
    );
};

export default Background;

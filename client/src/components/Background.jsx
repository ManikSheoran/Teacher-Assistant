import React, { useEffect, useRef } from "react";

const Background = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;
        let gradientAngle = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createGradient = () => {
            const gradient = ctx.createLinearGradient(
                0,
                0,
                canvas.width * Math.cos(gradientAngle),
                canvas.height * Math.sin(gradientAngle)
            );

            // Get theme colors from CSS variables
            const isDarkMode = document.body.classList.contains("dark-mode");
            const color1 = isDarkMode ? "#1a1a2e" : "#e3f2fd";
            const color2 = isDarkMode ? "#16213e" : "#bbdefb";

            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = getComputedStyle(
                    document.body
                ).getPropertyValue("--particle-color");
                ctx.fill();
                ctx.closePath();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach((p2) => {
                    const distance = Math.sqrt(
                        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
                    );
                    if (distance < 100) {
                        ctx.beginPath();
                        const alpha = 1 - distance / 100;
                        const isDarkMode =
                            document.body.classList.contains("dark-mode");
                        ctx.strokeStyle = isDarkMode
                            ? `rgba(100, 181, 246, ${alpha * 0.6})`
                            : `rgba(33, 150, 243, ${alpha * 0.4})`;
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
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        init();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
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
            }}
        />
    );
};

export default Background;

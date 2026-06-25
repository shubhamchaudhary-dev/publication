'use client';
import { useEffect, useRef } from 'react';

export default function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 400 : 1000;
    
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let canvasRect = canvas.getBoundingClientRect();

    const resizeCanvas = () => {
      canvasRect = canvas.getBoundingClientRect();
      canvas.width = canvasRect.width;
      canvas.height = canvasRect.height;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to center of screen, normalized from -1 to 1
      targetMouse.x = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
      targetMouse.y = ((e.clientY - canvasRect.top) / canvasRect.height) * 2 - 1;
    };
    
    const handleMouseLeave = () => {
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      baseX: number;
      baseY: number;
      baseZ: number;
      currentX: number;
      currentY: number;
      currentZ: number;
      prevX: number;
      prevY: number;
      prevZ: number;

      constructor() {
        // Distribute points on a 3D sphere
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        this.baseX = Math.sin(phi) * Math.cos(theta);
        this.baseY = Math.sin(phi) * Math.sin(theta);
        this.baseZ = Math.cos(phi);
        
        this.currentX = this.baseX;
        this.currentY = this.baseY;
        this.currentZ = this.baseZ;

        this.prevX = this.baseX;
        this.prevY = this.baseY;
        this.prevZ = this.baseZ;
      }

      update(time: number, rotX: number, rotY: number) {
        this.prevX = this.currentX;
        this.prevY = this.currentY;
        this.prevZ = this.currentZ;

        // Apply 3D rotation matrix
        // Rotate around X axis
        let y1 = this.baseY * Math.cos(rotX) - this.baseZ * Math.sin(rotX);
        let z1 = this.baseZ * Math.cos(rotX) + this.baseY * Math.sin(rotX);
        let x1 = this.baseX;

        // Rotate around Y axis
        let x2 = x1 * Math.cos(rotY) - z1 * Math.sin(rotY);
        let z2 = z1 * Math.cos(rotY) + x1 * Math.sin(rotY);
        let y2 = y1;

        this.currentX = x2;
        this.currentY = y2;
        this.currentZ = z2;
      }

      draw(ctx: CanvasRenderingContext2D, radiusX: number, radiusY: number, radiusZ: number, centerX: number, centerY: number) {
        const focalLength = radiusZ * 2.5;
        
        // 3D perspective projection for current point
        const z = this.currentZ * radiusZ;
        const scale = focalLength / (focalLength + z + radiusZ); // + radiusZ to shift shape forward
        const screenX = centerX + (this.currentX * radiusX * scale);
        const screenY = centerY + (this.currentY * radiusY * scale);

        // 3D perspective projection for previous point to draw a dash
        const pZ = this.prevZ * radiusZ;
        const pScale = focalLength / (focalLength + pZ + radiusZ);
        const pScreenX = centerX + (this.prevX * radiusX * pScale);
        const pScreenY = centerY + (this.prevY * radiusY * pScale);

        // Calculate opacity based on Z-depth (back of shape is faint)
        const normalizedZ = (this.currentZ + 1) / 2; // 0 (back) to 1 (front)
        const opacity = Math.max(0.05, normalizedZ * 0.8);

        // Gradient color from orange/red to blue/purple based on original 3D position
        const mix = (this.baseX + 1) / 2;
        const r = Math.floor(255 * (1 - mix) + 90 * mix);
        const g = Math.floor(90 * (1 - mix) + 70 * mix);
        const b = Math.floor(50 * (1 - mix) + 255 * mix);

        ctx.beginPath();
        ctx.moveTo(pScreenX, pScreenY);
        
        // Exaggerate the length of the dash slightly for better visibility
        const dx = screenX - pScreenX;
        const dy = screenY - pScreenY;
        ctx.lineTo(screenX + dx * 2, screenY + dy * 2);
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = Math.max(1.0, 3.5 * scale);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      // Detect dark mode on every frame so it responds to theme toggle
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#0F172A' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Smoothly interpolate mouse position
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      time += 1;
      const rotY = time * 0.002 + (mouse.x * 0.5);
      const rotX = time * 0.001 + (mouse.y * 0.5);

      // Cover the whole screen by setting radius to 65% of dimensions
      // This automatically distorts the shape into an enormous ellipsoid filling the page!
      const radiusX = canvas.width * 0.65;
      const radiusY = canvas.height * 0.65;
      const radiusZ = Math.min(radiusX, radiusY); // Keep Z depth proportional
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Sort particles by Z-depth so front particles render on top
      particles.sort((a, b) => a.currentZ - b.currentZ);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time, rotX, rotY);
        particles[i].draw(ctx, radiusX, radiusY, radiusZ, centerX, centerY);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

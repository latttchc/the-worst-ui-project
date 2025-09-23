"use client";
import { Heart, X } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

export interface MatchCardProps {
  children: React.ReactNode;
  onSwipe?: (direction: "left" | "right") => void;
  onCardLeftScreen?: () => void;
  className?: string;
  swipeThreshold?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export default function MatchCard({
  children,
  onSwipe,
  onCardLeftScreen,
  className = "",
  swipeThreshold = 100,
  cardWidth = 384,
  cardHeight = 500,
}: MatchCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [showIndicator, setShowIndicator] = useState<"like" | "nope" | null>(
    null,
  );

  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const animateToPosition = useCallback(
    (
      targetPos: { x: number; y: number },
      targetRotation: number,
      targetOpacity: number,
    ) => {
      const startPos = { ...position };
      const startRotation = rotation;
      const startOpacity = opacity;
      const startTime = Date.now();
      const duration = 300;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);

        setPosition({
          x: startPos.x + (targetPos.x - startPos.x) * easeOut,
          y: startPos.y + (targetPos.y - startPos.y) * easeOut,
        });
        setRotation(startRotation + (targetRotation - startRotation) * easeOut);
        setOpacity(startOpacity + (targetOpacity - startOpacity) * easeOut);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    },
    [position, rotation, opacity],
  );

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const pos = getEventPosition(e);
    startPos.current = pos;
    lastPos.current = pos;
    lastTime.current = Date.now();
  }, []);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setShowIndicator(null);

    const distance = Math.abs(position.x);
    const speed = Math.abs(velocity.current.x);

    const shouldSwipe = distance > swipeThreshold || speed > 800;

    if (shouldSwipe) {
      const direction = position.x > 0 ? "right" : "left";
      onSwipe?.(direction);

      const exitDistance = 1000;
      const exitX = position.x > 0 ? exitDistance : -exitDistance;

      setPosition({ x: exitX, y: 0 });
      setRotation(exitX * 0.2);
      setOpacity(0);

      setTimeout(() => {
        onCardLeftScreen?.();
      }, 300);

      return;
    }

    animateToPosition({ x: 0, y: 0 }, 0, 1);
  }, [
    isDragging,
    position.x,
    swipeThreshold,
    onSwipe,
    onCardLeftScreen,
    animateToPosition,
  ]);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      const pos =
        "touches" in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : { x: e.clientX, y: e.clientY };

      const deltaX = pos.x - startPos.current.x;
      const deltaY = pos.y - startPos.current.y;

      const now = Date.now();
      const timeDelta = now - lastTime.current;
      if (timeDelta > 0) {
        velocity.current = {
          x: ((pos.x - lastPos.current.x) / timeDelta) * 1000,
          y: 0,
        };
      }

      lastPos.current = pos;
      lastTime.current = now;

      setPosition({ x: deltaX, y: deltaY * 0.1 });
      setRotation(deltaX * 0.1);

      if (Math.abs(deltaX) > 50) {
        setShowIndicator(deltaX > 0 ? "like" : "nope");
      } else {
        setShowIndicator(null);
      }

      const maxDistance = 150;
      const currentDistance = Math.abs(deltaX);
      setOpacity(Math.max(0.6, 1 - (currentDistance / maxDistance) * 0.4));
    };

    const handleGlobalEnd = () => {
      handleEnd();
    };

    document.addEventListener("mousemove", handleGlobalMove);
    document.addEventListener("mouseup", handleGlobalEnd);
    document.addEventListener("touchmove", handleGlobalMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDragging, handleEnd]);

  return (
    <div
      ref={cardRef}
      className={`select-none transition-all duration-300 ease-out ${isDragging ? "cursor-grabbing z-50" : "cursor-grab"
        } ${className}`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        minWidth: `${cardWidth}px`,
        minHeight: `${cardHeight}px`,
        maxWidth: `${cardWidth}px`,
        maxHeight: `${cardHeight}px`,
        transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        opacity,
        touchAction: "none",
        userSelect: "none",
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* スワイプインジケーター */}
      {showIndicator && (
        <div
          className={`absolute top-6 ${showIndicator === "like" ? "left-6" : "right-6"} z-20 animate-pulse`}
        >
          <div
            className={`px-7 py-7 rounded-full text-white font-bold shadow-lg backdrop-blur-sm ${showIndicator === "like" ? "bg-green-500/90" : "bg-red-500/90"
              }`}
          >
            {showIndicator === "like" ?
              <Heart size={48} />
              : <X size={48} />
            }
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

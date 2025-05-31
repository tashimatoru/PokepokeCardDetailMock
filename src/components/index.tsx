import { useRef, useState, useCallback, useEffect } from "react";

function TiltCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null); // ← これがポイント！

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    touchStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - touchStart.current.x;
      const dy = e.clientY - touchStart.current.y;
      const maxY = 30;
      const maxX = 20;
      const y = Math.max(-maxY, Math.min(maxY, dx / 5));
      const x = Math.max(-maxX, Math.min(maxX, -dy / 5));
      setTilt({ x, y });
    },
    [isDragging]
  );

  const handleWindowMouseUp = useCallback(() => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
    window.removeEventListener("mousemove", handleWindowMouseMove);
    window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [handleWindowMouseMove]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, handleWindowMouseMove, handleWindowMouseUp]);

  // ref に対して touchmove イベントを追加（非passive）
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastX = 0;
    let lastY = 0;
    let ticking = false;
    let rafId = 0;

    const updateTilt = () => {
      const maxY = 30;
      const maxX = 20;
      const y = Math.max(-maxY, Math.min(maxY, lastX / 5));
      const x = Math.max(-maxX, Math.min(maxX, -lastY / 5));
      setTilt(prev => (prev.x === x && prev.y === y ? prev : { x, y }));
      ticking = false;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      lastX = touch.clientX - touchStart.current.x;
      lastY = touch.clientY - touchStart.current.y;
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateTilt);
      }
    };

    container.addEventListener("touchmove", touchMoveHandler, { passive: false });
    return () => {
      container.removeEventListener("touchmove", touchMoveHandler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        msTouchAction: "none"
      }}
    >
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src="/PokepokeCardDetailMock/img/card_1.png"
          style={{
            width: "100%",
            height: "auto",
            transition: isDragging ? "transform 0s" : "transform 0.2s",
            transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            background: `linear-gradient(${90 + tilt.y * 2}deg, rgba(255,255,255,${
              (Math.abs(tilt.x) + Math.abs(tilt.y)) / 80
            }) 40%, rgba(255,255,255,0) 80%)`,
            opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 5 ? 0.85 : 0,
            transition: isDragging ? "none" : "opacity 0.2s, background 0.2s, transform 0.2s",
            zIndex: 2,
            transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          }}
        />
      </div>
    </div>
  );
}

export default TiltCard;

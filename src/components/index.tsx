import { useRef, useState, useCallback, useEffect } from "react";

function App() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // スクロールを防止
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const maxY = 30;
    const maxX = 20;
    const y = Math.max(-maxY, Math.min(maxY, dx / 5));
    const x = Math.max(-maxX, Math.min(maxX, -dy / 5)); // 上下を反転
    setTilt({ x, y });
  };
  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 }); // 離したら元に戻す
  };

  // useCallbackで安定化
  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - touchStart.current.x;
      const dy = e.clientY - touchStart.current.y;
      const maxY = 30;
      const maxX = 20;
      const y = Math.max(-maxY, Math.min(maxY, dx / 5));
      const x = Math.max(-maxX, Math.min(maxX, -dy / 5)); // 上下を反転
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

  // useEffectでhandleWindowMouseMove/Upの参照を最新に保つ
  // これがないとイベント解除が効かず動作しなくなる
  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, handleWindowMouseMove, handleWindowMouseUp]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    touchStart.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <>
      <div>
        <div style={{ position: "relative", 
              margin: "0 auto",
              width: "70%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

        }}>
          <img
            src="/PokepokeCardDetailMock/img/card_1.png"
            style={{
              width: "100%",
              height: "auto",
              transition: isDragging ? "transform 0s" : "transform 0.2s",
              transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
          {/* 反射レイヤー */}
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              background: `linear-gradient(${90 + tilt.y * 2}deg, rgba(255,255,255,${(Math.abs(tilt.x) + Math.abs(tilt.y)) / 80}) 40%, rgba(255,255,255,0) 80%)`, // 反射の強さをやや強めに
              opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 5 ? 0.85 : 0, // 最大不透明度も少し上げる
              transition: isDragging ? "none" : "opacity 0.2s, background 0.2s, transform 0.2s",
              zIndex: 2,
              transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;

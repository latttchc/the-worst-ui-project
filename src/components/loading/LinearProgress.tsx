import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface LinearProgressWithLabelProps
  extends Omit<LinearProgressProps, "value"> {
  value?: number;
  autoProgress?: boolean;
  onComplete?: () => void;
}

export default function LinearProgressWithLabel({
  value: externalValue,
  autoProgress = false,
  onComplete,
  ...props
}: LinearProgressWithLabelProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!autoProgress) return;

    const startTime = Date.now();
    const phase1Duration = 1000; // Phase 1: 1秒で0%→80%
    const phase2Duration = 2000; // Phase 2: 2秒で80%→60%
    const phase3Duration = 2000; // Phase 3: 2秒で60%→92%
    const phase4Duration = 1000; // Phase 4: 1秒停止

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < phase1Duration) {
        // Phase 1: 1秒間で0%から80%まで進行
        const currentProgress = (elapsed / phase1Duration) * 80;
        setProgress(currentProgress);
        requestAnimationFrame(animate);
      } else if (elapsed < phase1Duration + phase2Duration) {
        // Phase 2: 0.3秒間で80%から60%まで後退
        const phase2Elapsed = elapsed - phase1Duration;
        const currentProgress = 80 - (phase2Elapsed / phase2Duration) * 20;
        setProgress(Math.max(currentProgress, 60));
        requestAnimationFrame(animate);
      } else if (elapsed < phase1Duration + phase2Duration + phase3Duration) {
        // Phase 3: 2秒間で60%から99%まで進行
        const phase3Elapsed = elapsed - (phase1Duration + phase2Duration);
        const currentProgress = 60 + (phase3Elapsed / phase3Duration) * 39;
        setProgress(currentProgress);
        requestAnimationFrame(animate);
      } else if (
        elapsed <
        phase1Duration + phase2Duration + phase3Duration + phase4Duration
      ) {
        // Phase 4: 1秒間99%で停止
        setProgress(99);
        requestAnimationFrame(animate);
      } else {
        // 最終段階：100%で完了
        setProgress(100);
        // 100%になった時にコールバックを呼び出す
        if (onComplete) {
          onComplete();
        }
      }
    };

    // 初期化
    setProgress(0);
    requestAnimationFrame(animate);
  }, [autoProgress]);

  // 外部からvalueが渡された場合はそれを使用、そうでなければ内部のprogressを使用
  const currentValue = externalValue !== undefined ? externalValue : progress;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={currentValue}
          {...props}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0040ff, #8000ff, #ff0080, #ff0000)",
              backgroundSize: "300% 100%",
              borderRadius: 5,
              animation: "rainbow-flow 2s linear infinite",
            },
            "@keyframes rainbow-flow": {
              "0%": {
                backgroundPosition: "0% 0%",
              },
              "100%": {
                backgroundPosition: "300% 0%",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(currentValue)}%`}</Typography>
      </Box>
    </Box>
  );
}

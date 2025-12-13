// Simple guided breathing controller (4-4-4 cycles)
      (function () {
        const startBtn = document.getElementById("startBtn");
        const stopBtn = document.getElementById("stopBtn");
        const circle = document.getElementById("circle");
        const label = document.getElementById("breathLabel");
        const count = document.getElementById("count");
        let running = false;
        let step = 0; // 0 inhale,1 hold,2 exhale
        let tick = 4;
        let cycles = 0;
        let timer = null;

        function updateVisual() {
          count.textContent = tick;
          if (step === 0) {
            circle.classList.remove("small");
            circle.classList.add("large");
            label.textContent = "Inhala";
          }
          if (step === 1) {
            label.textContent = "Mantén";
          }
          if (step === 2) {
            circle.classList.remove("large");
            circle.classList.add("small");
            label.textContent = "Exhala";
          }
        }

        function tickOnce() {
          if (!running) return;
          tick--;
          if (tick <= 0) {
            step = (step + 1) % 3;
            tick = 4;
            if (step === 0) {
              // new inhale started => increment cycles
              cycles++;
            }
          }
          updateVisual();
          if (cycles >= 4 && step === 0 && tick === 4) {
            // completed 4 full cycles
            stop();
            label.textContent = "Completado";
            return;
          }
        }

        function start() {
          if (running) return;
          running = true;
          step = 0;
          tick = 4;
          cycles = 0;
          updateVisual();
          timer = setInterval(tickOnce, 1000);
        }

        function stop() {
          running = false;
          if (timer) clearInterval(timer);
          timer = null;
          label.textContent = "Detenido";
        }

        startBtn.addEventListener("click", start);
        stopBtn.addEventListener("click", stop);
      })();
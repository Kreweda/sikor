let currentTime = 0; // 0 to 360 (0:00 to 6:00)
let battery = 100;
let lightOn = false;
let nightTitles = [
    "1. Zjawa Koteu",
    "2. Wybiła godzina 00.",
    "3. Śmiech na (nie) pustej sali.",
    "4. Zmiana szychty.",
    "5. Freddie czy to ty?",
    "6. Bal u Freddiego"
];
let nightIndex = 0;
let batteryInterval;
let mediaStream;

// Ustawienie tła
document.body.style.background = "url('https://th.bing.com/th/id/OIP.ytnveQd4rygRjC3qN24NpwHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7') no-repeat center center fixed";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundColor = "#000";

document.getElementById("time").style.position = "absolute";
document.getElementById("time").style.top = "10px";
document.getElementById("time").style.right = "10px";
document.getElementById("time").style.fontSize = "32px";
document.getElementById("time").style.fontFamily = "Arial, sans-serif";
document.getElementById("time").style.color = "#fff";

const timeLabel = document.getElementById("time");
const batteryBar = document.getElementById("battery-bar");
const batteryPercentage = document.getElementById("battery-percentage");
const lightButton = document.getElementById("light-button");
const attackButton = document.getElementById("attack-button");
const nightTitle = document.getElementById("night-title");
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", startNight);
lightButton.addEventListener("click", toggleLight);
attackButton.addEventListener("click", attack);

async function togglePhoneFlashlight(enable) {
    try {
        if (enable) {
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", torch: true } });
            let track = mediaStream.getVideoTracks()[0];
            await track.applyConstraints({ advanced: [{ torch: true }] });
        } else {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }
        }
    } catch (error) {
        console.error("Latarka nie jest obsługiwana na tym urządzeniu", error);
    }
}

function startNight() {
    currentTime = 0;
    battery = 100;
    nightIndex = 0;
    lightOn = false;
    lightButton.textContent = "Włącz latarkę";
    updateNightTitle();
    updateBatteryDisplay();
    updateTime();
    startBatteryDrain(6000);
}

function updateTime() {
    if (currentTime < 360) {
        currentTime++;
        let hours = Math.floor(currentTime / 60);
        let minutes = currentTime % 60;
        timeLabel.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        setTimeout(updateTime, 1000);
    } else {
        winNight();
    }
}

function startBatteryDrain(interval) {
    clearInterval(batteryInterval);
    batteryInterval = setInterval(() => {
        if (battery > 0) {
            battery -= 1;
            updateBatteryDisplay();
            if (battery <= 0) {
                battery = 0;
                clearInterval(batteryInterval);
                lightButton.disabled = true;
                attack();
            }
        }
    }, interval);
}

function updateBatteryDisplay() {
    battery = Math.max(0, battery);
    batteryBar.style.width = battery + "%";
    batteryPercentage.textContent = Math.floor(battery) + "%";
}

function toggleLight() {
    if (battery > 0) {
        lightOn = !lightOn;
        lightButton.textContent = lightOn ? "Wyłącz latarkę" : "Włącz latarkę";
        togglePhoneFlashlight(lightOn);
        startBatteryDrain(lightOn ? 3000 : 6000);
    }
}

function attack() {
    alert("Przegrałeś! Kliknij 'OK' aby zacząć od nowa.");
    resetGame();
}

function winNight() {
    alert(`Wygrałeś noc! Tytuł nocy: ${nightTitles[nightIndex]}`);
    nightIndex = (nightIndex + 1) % nightTitles.length;
    updateNightTitle();
    resetGame();
}

function resetGame() {
    clearInterval(batteryInterval);
    currentTime = 0;
    battery = 100;
    lightOn = false;
    lightButton.textContent = "Włącz latarkę";
    batteryBar.style.width = "100%";
    batteryPercentage.textContent = "100%";
    timeLabel.textContent = "00:00";
    togglePhoneFlashlight(false);
    startBatteryDrain(6000);
}

function updateNightTitle() {
    nightTitle.textContent = nightTitles[nightIndex];
}

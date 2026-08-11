document.addEventListener("DOMContentLoaded", () => {
    const calculator = document.getElementById("roi-calculator");
    if (!calculator) return;

    const hoursOutput = document.getElementById("hours-result");
    const valueOutput = document.getElementById("value-result");
    const number = new Intl.NumberFormat("et-EE", {maximumFractionDigits: 1});
    const currency = new Intl.NumberFormat("et-EE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    });

    const read = (id, max = Number.POSITIVE_INFINITY) => {
        const raw = Number(document.getElementById(id)?.value || 0);
        return Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), max);
    };

    const calculate = () => {
        const tasks = read("tasks-per-day");
        const minutes = read("minutes-per-task");
        const days = read("workdays", 31);
        const share = read("automation-share", 100) / 100;
        const hourlyCost = read("hourly-cost");
        const hours = tasks * minutes * days * share / 60;

        if (hoursOutput) hoursOutput.textContent = `${number.format(hours)} tundi`;
        if (valueOutput) valueOutput.textContent = currency.format(hours * hourlyCost);
    };

    calculator.addEventListener("input", calculate);
    calculate();
});

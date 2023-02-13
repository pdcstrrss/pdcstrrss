export class Utilities {
  static formatSecondsToHumanTime(seconds: number) {
    if (isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    const formattedMinutes = this.formatIntegerToFixed(minutes, 2);
    const formattedSeconds = this.formatIntegerToFixed(secondsLeft, 2);
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  static formatIntegerToFixed(number: number, amount: number) {
    return number.toString().padStart(amount, '0');
  }

  static transformAbsoluteFromPercentage(percentage: number, total: number) {
    return (percentage / 100) * total;
  }
}

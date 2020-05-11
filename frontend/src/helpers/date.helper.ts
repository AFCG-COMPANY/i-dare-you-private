export function getFormattedDateString(date: Date): string {
    const day = toFixedLength(date.getDate());
    const month = toFixedLength(date.getMonth() + 1);

    return day + '.' + month + '.' + date.getFullYear();
}

function toFixedLength(dateFragment: number): string | number {
    return dateFragment > 9 ? dateFragment : '0' + dateFragment;
}

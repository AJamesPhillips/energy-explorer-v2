

export const is_narrow_screen = () => window.innerWidth <= 800
export const is_touch_screen = () =>
{
    return /Mobi|Android/i.test(navigator.userAgent)
    // On iPad the userAgent does not allow it to be distinguished from a Mac so
    // this approach does not work: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15"
    || /Tablet|iPad/i.test(navigator.userAgent)
}

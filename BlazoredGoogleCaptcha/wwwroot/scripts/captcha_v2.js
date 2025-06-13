let recaptchaReady = false;
const callbacks = [];

export async function loadRecaptcha() {
    if (recaptchaReady) return true;
    return new Promise((resolve, reject) => {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
            recaptchaReady = true;
            resolve(true);
            return;
        }
        window.onRecaptchaLoaded = () => {
            recaptchaReady = true;
            callbacks.forEach(cb => cb());
            resolve(true);
        };
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
        document.head.appendChild(script);
    });
}
export function renderRecaptcha(element, siteKey, dotNetObject) {
    if (!recaptchaReady) {
        return new Promise(resolve => {
            callbacks.push(() => {
                resolve(doRender(element, siteKey, dotNetObject));
            });
        });
    }
    return doRender(element, siteKey, dotNetObject);
}
function doRender(element, siteKey, dotNetObject) {
    return grecaptcha.render(element, {
        sitekey: siteKey,
        callback: (response) => dotNetObject.invokeMethodAsync('HandleSuccess', response),
        'expired-callback': () => dotNetObject.invokeMethodAsync('HandleExpired')
    });
} 
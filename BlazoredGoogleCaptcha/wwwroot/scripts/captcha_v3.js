let recaptchaV3Loaded = false;
let recaptchaLoadPromise = null;
// Create a separate namespace for v3 
window.grecaptchaV3 = {
    ready: (callback) => {
        if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(callback);
        } else {
            callback();
        }
    },
    execute: null
};
export async function ensureRecaptchaLoaded(siteKey) {
    if (recaptchaV3Loaded) {
        return;
    }
    if (recaptchaLoadPromise) {
        return recaptchaLoadPromise;
    }
    recaptchaLoadPromise = new Promise((resolve, reject) => {
        // Check if v3 is already available 

        //if (window.grecaptcha && window.grecaptcha.execute) {

        //    recaptchaV3Loaded = true;

        //    window.grecaptchaV3.execute = window.grecaptcha.execute;

        //    resolve();

        //    return;

        //}
        // Create a new script with a unique callback 
        const callbackName = `recaptchaV3Onload_${Date.now()}`;
        window[callbackName] = () => {
            if (!window.grecaptcha || !window.grecaptcha.execute) {
                reject(new Error('reCAPTCHA v3 failed to load'));
                return;
            }
            // Store v3 methods in our namespace 
            window.grecaptchaV3.execute = window.grecaptcha.execute;
            recaptchaV3Loaded = true;
            delete window[callbackName];
            resolve();
        };
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=${callbackName}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            delete window[callbackName];
            reject(new Error('Failed to load reCAPTCHA v3 script'));
        };
        document.head.appendChild(script);
    });
    return recaptchaLoadPromise;
}
export async function executeRecaptchaV3(siteKey, action, dotNetObject) {
    try {
        await ensureRecaptchaLoaded(siteKey);
        const token = await window.grecaptchaV3.execute(siteKey, { action });
        if (dotNetObject) {
            dotNetObject.invokeMethodAsync('HandleVerification', token, action);
        }
        return token;
    } catch (error) {
        console.error('reCAPTCHA v3 error:', error);
        throw error;
    }
} 
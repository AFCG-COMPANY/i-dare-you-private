import * as admin from 'firebase-admin';

const serviceAccount: any = {
    "type": "service_account",
    "project_id": "i-dare-you-142ea",
    "private_key_id": "a6e12f7d57cab6007a735b6f40c31e237192f523",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpSp0PPkfqYizD\nIIPM6+wTpne7gLcc2ltx/W/5izMnaKl/GPd5gxCb6uvqnRarTJ+obLho2T6bP91G\nf25oJxDBqpRdC3cM+ADpUsVP53KDCL3dpb/GhnZOBLuygY5cA6tJsFm24mTXq+ho\nF7EFvFMXj3PAC/bfTX9wxvctWlqHOc6sST+2gM1DeUZGuJTAN0ld9VwVXDtgpvm8\nG18EnQi0T45qrlWrwU3SGTlLEp+8dxgIEzK4hG0FYvjXTmycVkIL6i0WAo8a5Acs\nAtNagxr+nhZGZHeNaUX5PkGs90Fs6/tkeZFgqb59W/l//xWKfhGNsYjhWltVIrOQ\n5RI6vgyFAgMBAAECggEABlrTkEdrud7xxDXCJmnMV/Gw3xwWHS8OYLYjqZyxw/uk\n5S1h2MqOAvRSFi5lM/Mkr4gi2GWGeQIJ0EQnUYfDesM1Xe34vy1hR2DnVDg7CObF\nzcsThFddNVEhkWVVaGg6c7UuR1p/PSzp6yjJT3UbmPy2QR7FDeo7hVdXeJKpARg5\nARgqQqAuO7twoAEIPR4ZniVsYv5VqCb011mPtHUFD7+VIeCpJZoWOb76EiwUzi4E\nhdPShdUOutN0/JUhLP0TUC0Lt/+bnA/nreuu8W0F+Q6lJvXXH0/0hig2SdeVCMYJ\nNUeFNprFq/Kd1grfeGLCkz4ElOo2RGP8BOTfyPYRgQKBgQDnRPdvM0NKwkaR4Wgo\nqB/+vqHA5bPnVNFqopy6urbh5vfQGDqdxihzDXkSa0h1siIWEeGOPckvCB4dtTcn\n4evkc4iYYZmO7nqOtPn5hadvDCLVIPEcMrBqyrkCI+5kJHgmJPQY3CdCCXusacFK\nW+XLr28scW4ou2pxZ7AtrJHdwQKBgQC7ZP3nktBdWognSOOh82fPYNrHG8TwlhaJ\nBZPCqX9Dw/usJZTr7mBWFk178v5vsTuYgx5oJlG/zpFe3rsLMOokRfAlDaO4qoA+\nwrYjAY5CzmGCRFjYDi1j3UQcngQvIaa7Jei23kYqIMjrm2LhL0ydR28oIgCoavhj\n3lXnLzYnxQKBgDFZzTdEiCqO1IJSyGhMoC87PMct/TrzJZEMzEcoitgf8mfMk82R\nOJZ8nIZqsFa1QYLWI/y3gJPxtoN+ZRu0oSLp6I8j3KHcj/id8+3kMHuI6nHyiqEK\nzAyt39buFfP2uFDjd9dKO3JjFaoQEzgr7hiOAjpIpko43BkBGF5WwfXBAoGAGPQm\n12p2cqf2j3ymS0+VWEkmePMas4rY72AdwANAHi7/2XmbrhstGumXYdUGyqrIK9Px\n/Z50rlz8gKyaLbBSzYe+pcB+N74Em9bj2B+B6SWAWI9vYT3qD21Mf58PIZOSl0NC\nDO/mWf/JoY4siZ35zsvPYoG8orCz6OCXgdSImp0CgYBPd5F6Ri3h1kL5mXEHU0cG\nf6V0cJeb3ik5vA/7+yvKrAmJ+1e5pfyuX27E4HTGgZWAW4XT44hCDU3187CyF/5d\nrUSZUUJilA9CZpLWGk7vNKHoC9ukQwe9VGIhisJpMM22+Z+v0nMxBQd0EZnlgcrY\nXokrZ77jAGCfXx6GKiWG5g==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3c3g8@i-dare-you-142ea.iam.gserviceaccount.com",
    "client_id": "116484218625503962386",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3c3g8%40i-dare-you-142ea.iam.gserviceaccount.com"
};


admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://i-dare-you-142ea.firebaseio.com"
    }
);

export default admin;
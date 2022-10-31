const axios = require("axios"),
    rateLimit = require("axios-rate-limit"),
    puppeteer = require("puppeteer-extra"),
    RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha"),
    StealthPlugin = require("puppeteer-extra-plugin-stealth"),
    uniqid = require("uniqid"),
    crypto = require("crypto"),
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36w";
let ssoCookie, baseCookie = "new_SiteId=cod; ACT_SSO_LOCALE=en_US;country=US;",
    loggedIn = !1,
    debug = 0,
    apiAxios = axios.create({
        headers: {
            common: {
                "content-type": "application/json",
                cookie: baseCookie,
                "x-requested-with": userAgent,
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                Connection: "keep-alive"
            }
        },
        withCredentials: !0
    }),
    loginAxios = apiAxios,
    defaultBaseURL = "https://my.callofduty.com/api/papi-client/",
    defaultProfileURL = "https://profile.callofduty.com/";
class helpers {
    buildUri(str) {
        return `${defaultBaseURL}${str}`
    }
    buildProfileUri(str) {
        return `${defaultProfileURL}${str}`
    }
    cleanClientName(gamertag) {
        return encodeURIComponent(gamertag)
    }
    sendRequestUserInfoOnly(url) {
        return new Promise(((resolve, reject) => {
            loggedIn || reject("Not Logged In."), apiAxios.get(url).then((body => {
                403 == body.status && reject("Forbidden. You may be IP banned."), 1 === debug && (console.log("[DEBUG]", `Build URI: ${url}`), console.log("[DEBUG]", `Round trip took: ${body.headers["request-duration"]}ms.`), console.log("[DEBUG]", `Response Size: ${JSON.stringify(body.data).length} bytes.`)), resolve(JSON.parse(body.data.replace(/^userInfo\(/, "").replace(/\);$/, "")))
            })).catch((err => reject(err)))
        }))
    }
    sendRequest(url) {
        return new Promise(((resolve, reject) => {
            loggedIn || reject("Not Logged In."), apiAxios.get(url).then((response => {
                1 === debug && (console.log("[DEBUG]", `Build URI: ${url}`), console.log("[DEBUG]", `Round trip took: ${response.headers["request-duration"]}ms.`), console.log("[DEBUG]", `Response Size: ${JSON.stringify(response.data.data).length} bytes.`)), void 0 !== response.data.status && "success" === response.data.status ? resolve(response.data.data) : reject(this.apiErrorHandling({
                    response: response
                }))
            })).catch((error => {
                reject(this.apiErrorHandling(error))
            }))
        }))
    }
    sendPostRequest(url, data) {
        return new Promise(((resolve, reject) => {
            loggedIn || reject("Not Logged In."), apiAxios.post(url, JSON.stringify(data)).then((response => {
                1 === debug && (console.log("[DEBUG]", `Build URI: ${url}`), console.log("[DEBUG]", `Round trip took: ${response.headers["request-duration"]}ms.`), console.log("[DEBUG]", `Response Size: ${JSON.stringify(response.data.data).length} bytes.`)), void 0 !== response.data.status && "success" === response.data.status ? resolve(response.data.data) : reject(this.apiErrorHandling({
                    response: response
                }))
            })).catch((error => {
                reject(this.apiErrorHandling(error))
            }))
        }))
    }
    sendRawRequest(url) {
        return new Promise(((resolve, reject) => {
            apiAxios.get(url).then((response => {
                1 === debug && (console.log("[DEBUG]", `Build URI: ${url}`), console.log("[DEBUG]", `Round trip took: ${response.headers["request-duration"]}ms.`), console.log("[DEBUG]", `Response Size: ${JSON.stringify(response.data).length} bytes.`)), void 0 !== response.status && 200 === response.status ? resolve(response.data) : reject(this.apiErrorHandling({
                    response: response
                }))
            })).catch((err => {
                reject(this.apiErrorHandling(err))
            }))
        }))
    }
    postReq(url, data, headers = null) {
        return new Promise(((resolve, reject) => {
            loginAxios.post(url, data, headers).then((response => {
                resolve(response.data)
            })).catch((error => {
                reject(this.apiErrorHandling(error))
            }))
        }))
    }
    makeid(length) {
        for (var result = "", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-", charactersLength = characters.length, i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result
    }
    apiErrorHandling(error) {
        if (!error) return "We Could not get a valid reason for a failure."; {
            let response = error.response;
            if (!response) return `We Could not get a valid reason for a failure. Status: ${error}`;
            switch (response.status) {
                case 200:
                    const apiErrorMessage = void 0 !== response.data && void 0 !== response.data.data && void 0 !== response.data.data.message ? response.data.data.message : void 0 !== response.message ? response.message : "No error returned from API.";
                    switch (apiErrorMessage) {
                        case "Not permitted: user not found":
                            return "404 - Not found. Incorrect username or platform? Misconfigured privacy settings?";
                        case "Not permitted: rate limit exceeded":
                            return "429 - Too many requests. Try again in a few minutes.";
                        case "Error from datastore":
                            return "500 - Internal server error. Request failed, try again.";
                        default:
                            return apiErrorMessage
                    }
                    break;
                case 401:
                    return "401 - Unauthorized. Incorrect username or password.";
                case 403:
                    return "403 - Forbidden. You may have been IP banned. Try again in a few minutes.";
                case 500:
                    return "500 - Internal server error. Request failed, try again.";
                case 502:
                    return "502 - Bad gateway. Request failed, try again.";
                default:
                    return `We Could not get a valid reason for a failure. Status: ${response.status}`
            }
        }
    }
}
module.exports = function(config = {}) {
    var module = {};
    null == config.platform && (config.platform = "psn"), void 0 === config.timeout || isNaN(config.timeout) || (apiAxios.defaults.timeout = config.timeout), 1 === config.debug && (debug = 1, apiAxios.interceptors.request.use((resp => (resp.headers["request-startTime"] = process.hrtime(), resp))), apiAxios.interceptors.response.use((response => {
        const start = response.config.headers["request-startTime"],
            end = process.hrtime(start),
            milliseconds = Math.round(1e3 * end[0] + end[1] / 1e6);
        return response.headers["request-duration"] = milliseconds, response
    })));
    try {
        "object" == typeof config.ratelimit && (apiAxios = rateLimit(apiAxios, config.ratelimit))
    } catch (Err) {
        console.warn("Could not parse ratelimit object. ignoring.")
    }
    return _helpers = new helpers, module.platforms = {
        battle: "battle",
        steam: "steam",
        psn: "psn",
        xbl: "xbl",
        acti: "acti",
        uno: "uno",
        all: "all"
    }, module.login = function(username, password, captureKey, headless = !0) {
        return new Promise((async (resolve, reject) => {
            puppeteer.use(StealthPlugin()), puppeteer.use(RecaptchaPlugin({
                provider: {
                    id: "2captcha",
                    token: captureKey
                },
                visualFeedback: !0
            })), puppeteer.launch({
                headless: headless,
                args: ["--no-sandbox"]
            }).then((async browser => {
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(12e4), await page.goto("https://profile.callofduty.com/cod/login"), await page.type("#username", username, {
                    delay: 100
                }), await page.type("#password", password, {
                    delay: 100
                }), await page.solveRecaptchas(), await Promise.all([page.waitForNavigation(), page.click("#login-button", {
                    delay: 250
                })]);
                const cookies = await page.cookies(),
                    auth = {
                        xsrf: cookies.find((c => "XSRF-TOKEN" === c.name))?.value,
                        sso: cookies.find((c => "ACT_SSO_COOKIE" === c.name))?.value,
                        atkn: cookies.find((c => "atkn" === c.name))?.value
                    };
                if (await browser.close(), void 0 === auth.sso || void 0 === auth.atkn) throw new Error("Failed to Login");
                ssoCookie = auth.sso, apiAxios.defaults.headers.common.cookie = `XSRF-TOKEN=${auth.xsrf};ACT_SSO_COOKIE=${auth.sso};atkn=${auth.atkn};`, resolve("200 - successful login."), loggedIn = !0
            })).catch((e => reject(_helpers.apiErrorHandling(e))))
        }))
    }, module.loginWithSSO = function(sso) {
        return new Promise((async (resolve, reject) => {
            (void 0 === sso || sso.length <= 0) && reject("SSO token is invalid.");
            let randomId = uniqid(),
                deviceId = crypto.createHash("md5").update(randomId).digest("hex");
            _helpers.postReq("https://profile.callofduty.com/cod/mapp/registerDevice", {
                deviceId: deviceId
            }).then((response => {
                console.log(response);
                let authHeader = response.data.authHeader,
                    fakeXSRF = "68e8b62e-1d9d-4ce1-b93f-cbe5ff31a041";
                apiAxios.defaults.headers.common.Authorization = `bearer ${authHeader}`, apiAxios.defaults.headers.common.x_cod_device_id = `${deviceId}`, apiAxios.defaults.headers.common["X-XSRF-TOKEN"] = fakeXSRF, apiAxios.defaults.headers.common["X-CSRF-TOKEN"] = fakeXSRF, apiAxios.defaults.headers.common["Acti-Auth"] = `Bearer ${sso}`, ssoCookie = sso, apiAxios.defaults.headers.common.cookie = baseCookie + `${baseCookie}ACT_SSO_COOKIE=${sso};XSRF-TOKEN=${fakeXSRF};API_CSRF_TOKEN=${fakeXSRF};`, loggedIn = !0, resolve("200 - Logged in with SSO.")
            })).catch((err => {
                "string" == typeof err && reject(err), reject(err.message)
            }))
        }))
    }, module.BO4Stats = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4zm = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/zm`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4mp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4blackout = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/wz`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4friends = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && reject("Battlenet does not support Friends.");
            let urlInput = _helpers.buildUri(`leaderboards/v2/title/bo4/platform/${platform}/time/alltime/type/core/mode/career/gamer/${gamertag}/friends`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/mp/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatmpdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/mp/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatzm = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/zombies/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatzmdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/zombies/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatbo = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/warzone/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4combatbodate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead."), "battle" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/warzone/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.BO4leaderboard = function(page, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for BO4. Try `battle` instead.");
            let urlInput = _helpers.buildUri(`leaderboards/v2/title/bo4/platform/${platform}/time/alltime/type/core/mode/career/page/${page}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWleaderboard = function(page, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead.");
            let urlInput = _helpers.buildUri(`leaderboards/v2/title/mw/platform/${platform}/time/alltime/type/core/mode/career/page/${page}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWcombatmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWcombatmpdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWcombatwz = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWcombatwzdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWfullcombatmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWfullcombatmpdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWfullcombatwz = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/0/end/0`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWfullcombatwzdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/${start}/end/${end}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWwz = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/wz`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWBattleData = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            brDetails = {}, this.MWwz(gamertag, platform).then((data => {
                let lifetime = data.lifetime;
                if (void 0 !== lifetime) {
                    let filtered = Object.keys(lifetime.mode).filter((x => x.startsWith("br"))).reduce(((obj, key) => (obj[key] = lifetime.mode[key], obj)), {});
                    void 0 !== filtered.br && (filtered.br.properties.title = "br", brDetails.br = filtered.br.properties), void 0 !== filtered.br_dmz && (filtered.br_dmz.properties.title = "br_dmz", brDetails.br_dmz = filtered.br_dmz.properties), void 0 !== filtered.br_all && (filtered.br_all.properties.title = "br_all", brDetails.br_all = filtered.br_all.properties)
                }
                resolve(brDetails)
            })).catch((e => reject(e)))
        }))
    }, module.MWfriends = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), "battle" === platform && reject("Battlenet friends are not supported. Try a different platform."), "uno" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/friends/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWWzfriends = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), "battle" === platform && reject("Battlenet friends are not supported. Try a different platform."), "uno" === platform && (gamertag = _helpers.cleanClientName(gamertag));
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/friends/type/wz`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWstats = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWwzstats = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/wz`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWweeklystats = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            weeklyStats = {}, this.MWstats(gamertag, platform).then((data => {
                void 0 !== data.weekly && (weeklyStats.mp = data.weekly), this.MWwzstats(gamertag, platform).then((data => {
                    void 0 !== data.weekly && (weeklyStats.wz = data.weekly), resolve(weeklyStats)
                })).catch((e => reject(e)))
            })).catch((e => reject(e)))
        }))
    }, module.MWloot = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`loot/title/mw/platform/${platform}/${lookupType}/${gamertag}/status/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWAnalysis = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v2/title/mw/platform/${platform}/gametype/all/gamer/${gamertag}/summary/match_analysis/contentType/full/end/0/matchAnalysis/mobile/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWMapList = function(platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v1/title/mw/platform/${platform}/gameType/mp/communityMapData/availability`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWFullMatchInfomp = function(matchId, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/fullMatch/mp/${matchId}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.MWFullMatchInfowz = function(matchId, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/mw/platform/${platform}/fullMatch/wz/${matchId}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for CW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/cw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWloot = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`loot/title/cw/platform/${platform}/${lookupType}/${gamertag}/status/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWAnalysis = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for MW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v2/title/cw/platform/${platform}/gametype/all/gamer/${gamertag}/summary/match_analysis/contentType/full/end/0/matchAnalysis/mobile/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWMapList = function(platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v1/title/cw/platform/${platform}/gameType/mp/communityMapData/availability`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWcombatmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for CW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/cw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWcombatdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for CW. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/cw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.CWFullMatchInfo = function(matchId, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/cw/platform/${platform}/fullMatch/mp/${matchId}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for VG. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`stats/cod/v1/title/vg/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGloot = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for VG. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`loot/title/vg/platform/${platform}/${lookupType}/${gamertag}/status/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGAnalysis = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for VG. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v2/title/vg/platform/${platform}/gametype/all/gamer/${gamertag}/summary/match_analysis/contentType/full/end/0/matchAnalysis/mobile/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGMapList = function(platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`ce/v1/title/vg/platform/${platform}/gameType/mp/communityMapData/availability`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGcombatmp = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for VG. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/vg/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGcombatdate = function(gamertag, start = 0, end = 0, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "steam" === platform && reject("Steam Doesn't exist for VG. Try `battle` instead."), gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/vg/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}/details`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.VGFullMatchInfo = function(matchId, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/title/vg/platform/${platform}/fullMatch/mp/${matchId}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.GetPurchasablePublic = function() {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildUri("inventory/v1/title/cw/platform/psn/purchasable/public/en");
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getBundleInformation = function(title, bundleId) {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildUri(`inventory/v1/title/${title}/bundle/${bundleId}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.friendFeed = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            gamertag = _helpers.cleanClientName(gamertag), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`userfeed/v1/friendFeed/platform/${platform}/gamer/${gamertag}/friendFeedEvents/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getEventFeed = function() {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildUri(`userfeed/v1/friendFeed/rendered/en/${ssoCookie}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getLoggedInIdentities = function() {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildUri(`crm/cod/v2/identities/${ssoCookie}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getLoggedInUserInfo = function() {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildProfileUri(`cod/userInfo/${ssoCookie}`);
            _helpers.sendRequestUserInfoOnly(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.FuzzySearch = function(query, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "battle" !== platform && "uno" != platform && "all" != platform || (query = _helpers.cleanClientName(query)), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/platform/${platform}/username/${query}/search`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getBattlePassInfo = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "battle" !== platform && "uno" != platform && "acti" !== platform || (gamertag = _helpers.cleanClientName(gamertag));
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`loot/title/mw/platform/${platform}/${lookupType}/${gamertag}/status/en`);
            console.log(urlInput), _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getCodPoints = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno), gamertag = _helpers.cleanClientName(gamertag);
            let urlInput = _helpers.buildUri(`inventory/v1/title/mw/platform/${platform}/gamer/${gamertag}/currency`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getBattlePassLoot = function(season, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`loot/title/mw/platform/${platform}/list/loot_season_${season}/en`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getPurchasable = function(platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`inventory/v1/title/mw/platform/${platform}/purchasable`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.purchaseItem = function(gamertag, item = "battle_pass_upgrade_bundle_4", platform = config.platform) {
        return new Promise(((resolve, reject) => {
            "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno), gamertag = _helpers.cleanClientName(gamertag);
            let urlInput = _helpers.buildUri(`inventory/v1/title/mw/platform/${platform}/gamer/${gamertag}/item/${item}/purchaseWith/CODPoints`);
            _helpers.sendPostRequest(urlInput, {}).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.getGiftableFriends = function(unoId, itemSku = "432000") {
        return new Promise(((resolve, reject) => {
            let urlInput = _helpers.buildUri(`gifting/v1/title/mw/platform/uno/${unoId}/sku/${itemSku}/giftableFriends`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.sendGift = function(gamertag, recipientUnoId, senderUnoId, itemSku = "432000", sendingPlatform = config.platform, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            let data = {
                recipientUnoId: recipientUnoId,
                senderUnoId: senderUnoId,
                sendingPlatform: sendingPlatform,
                sku: Number(itemSku)
            };
            gamertag = _helpers.cleanClientName(gamertag);
            let urlInput = _helpers.buildUri(`gifting/v1/title/mw/platform/${platform}/gamer/${gamertag}`);
            _helpers.sendPostRequest(urlInput, data).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.ConnectedAccounts = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            gamertag = _helpers.cleanClientName(gamertag);
            let lookupType = "gamer";
            "uno" === platform && (lookupType = "id"), "uno" !== platform && "acti" !== platform || (platform = this.platforms.uno);
            let urlInput = _helpers.buildUri(`crm/cod/v2/accounts/platform/${platform}/${lookupType}/${gamertag}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.Presence = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            gamertag = _helpers.cleanClientName(gamertag);
            let urlInput = _helpers.buildUri(`crm/cod/v2/friends/platform/${platform}/gamer/${gamertag}/presence/1/${ssoCookie}`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.Settings = function(gamertag, platform = config.platform) {
        return new Promise(((resolve, reject) => {
            gamertag = _helpers.cleanClientName(gamertag);
            let urlInput = _helpers.buildUri(`preferences/v1/platform/${platform}/gamer/${gamertag}/list`);
            _helpers.sendRequest(urlInput).then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.isLoggedIn = function() {
        return loggedIn
    }, module.getLookupValues = function() {
        return new Promise(((resolve, reject) => {
            _helpers.sendRawRequest("https://my.callofduty.com/content/atvi/callofduty/mycod/web/en/data/json/iq-content-xweb.js").then((data => resolve(data))).catch((e => reject(e)))
        }))
    }, module.apiAxios = apiAxios, module
};
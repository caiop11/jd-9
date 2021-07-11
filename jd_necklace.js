/*
点点券，可以兑换无门槛红包（1元，5元，10元，100元，部分红包需抢购）
Last Modified time: 2021-05-28 17:27:14
活动入口：京东APP-领券中心/券后9.9-领点点券 [活动地址](https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html)
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===============Quantumultx===============
[task_local]
#点点券
10 0,20 * * * jd_necklace.js, tag=点点券, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "10 0,20 * * *" script-path=jd_necklace.js,tag=点点券

===============Surge=================
点点券 = type=cron,cronexp="10 0,20 * * *",wake-system=1,timeout=3600,script-path=jd_necklace.js

============小火箭=========
点点券 = type=cron,script-path=jd_necklace.js, cronexpr="10 0,20 * * *", timeout=3600, enable=true
*/
 */
const $ = new Env('点点券');
const ZooFaker=require('./ZooFaker_Necklace.js') 
let allMessage = ``;
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const openUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html%22%20%7D`

const UA = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)};`
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
let message = '';
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
//IOS等用户直接用NobyDa的jd cookie
	@@ -43,16 +44,18 @@ const JD_API_HOST = 'https://api.m.jd.com/api';
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  // console.log(`\n通知：京东已在领取任务、签到、领取点点券三个添加了log做了校验，暂时无可解决\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      await ZooFaker.getBody($)
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
	@@ -63,6 +66,7 @@ const JD_API_HOST = 'https://api.m.jd.com/api';
        continue
      }
      await jd_necklace();
      // break
    }
  }
  if ($.isNode() && allMessage) {
	@@ -91,13 +95,13 @@ async function jd_necklace() {
}
function showMsg() {
  return new Promise(async resolve => {
    // if (nowTimes.getHours() >= 20) {
      $.msg($.name, '', `京东账号${$.index} ${$.nickName || $.UserName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击弹窗即可去兑换(注：此红包具有时效性)`, { 'open-url': openUrl});
    // }
    // 云端大于10元无门槛红包时进行通知推送
    // if ($.isNode() && $.totalScore >= 20000 && nowTimes.getHours() >= 20) await notify.sendNotify(`${$.name} - 京东账号${$.index}`, `京东账号${$.index}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击链接即可去兑换(注：此红包具有时效性)\n↓↓↓ \n\n ${openUrl} \n\n ↑↑↑`, { url: openUrl })
    if ($.isNode() && nowTimes.getHours() >= 20 && (process.env.DDQ_NOTIFY_CONTROL ? process.env.DDQ_NOTIFY_CONTROL === 'false' : !!1)) {
      allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n(京东APP->领券->左上角点点券.注：此红包具有时效性)${$.index !== cookiesArr.length ? '\n\n' : `\n↓↓↓ \n\n "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html" \n\n ↑↑↑`}`
    }
    resolve()
  })
	@@ -148,15 +152,18 @@ async function reportTask(item = {}) {
    }
  }
  //首页浏览XX秒的任务
  console.log(item)
  if (item['taskType'] === 3) await doAppTask('3', item.id);
  if (item['taskType'] === 4) await doAppTask('4', item.id);
}
//每日签到福利
function necklace_sign() {
  return new Promise(async resolve => {
    $.action = 'sign'
    const body=await ZooFaker.getBody($)
    // const body = {
    //   currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    // }
    $.post(taskPostUrl("necklace_sign", body), async (err, resp, data) => {
      try {
        if (err) {
	@@ -220,11 +227,14 @@ function necklace_exchangeGift(scoreNums) {
}
//领取奖励
function necklace_chargeScores(bubleId) {
  return new Promise(async resolve => {
    $.id = bubleId
    $.action = 'chargeScores'
    const body=await ZooFaker.getBody($)
    // const body = {
    //   bubleId,
    //   currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    // }
    $.post(taskPostUrl("necklace_chargeScores", body), async (err, resp, data) => {
      try {
        if (err) {
	@@ -252,12 +262,18 @@ function necklace_chargeScores(bubleId) {
  })
}
function necklace_startTask(taskId, functionId = 'necklace_startTask', itemId = "") {
  return new Promise(async resolve => {
    let body = {
      taskId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    if(functionId == 'necklace_startTask'){
      $.id = taskId
      $.action = 'startTask'
      body=await ZooFaker.getBody($)
    }else{
      if (itemId) body['itemId'] = itemId;
    }
    $.post(taskPostUrl(functionId, body), async (err, resp, data) => {
      try {
        if (err) {
	@@ -349,50 +365,51 @@ function necklace_homePage() {
}

async function doAppTask(type = '3', id) {
  console.log(id)
  let functionId = 'getCcTaskList'
  let body = "area=16_1315_3486_59648&body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22globalLat%22%3A%2224.49335%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22globalLng%22%3A%22118.1423%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=75afd018b5751e9ac4cba0b51b8adb3c&st=1624535152771&sv=101&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b"
  await getCcTaskList(functionId, body, type);
  if(Number(id) == 229){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22taskId%22%3A%22necklace_229%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=57453a76ffe9440d7961b05405fb4f13&st=1624535165882&sv=110&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(Number(id) == 260){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22hRRVbEkLST%2BoqUB6fhir%2BfMoJS814u0eqASGoy8xq0vV1m9X9zKoAVYtaZjcO4UsQaWNyUrMVkZK5HBZ5aJo5zQ%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49435886957707%22%2C%22taskId%22%3A%22necklace_260%22%2C%22lng%22%3A%22118.144791637343%22%2C%22eid%22%3A%22eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm%5C/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=51&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=93249982ced7ec850c69de8b3e859dab&st=1624610691429&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJSTfJm3Nbyn7GqB7OtrJRuHoZMYV%2Bs0mkEZsSwjxzwlDPXLeepml5BnM5XPZQmPVomYBHlkSfLJWR5D1y0Ovgf60fpjMS2gXL5aLh50cNO3cmx2GvVTaTeYxvRUl%2BpaW7HXsuBhxJgA6pUzd01tBX9yiFih8xvToesg91Nl8KcWGYzXJ2/hWKXg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }else if(Number(id) == 267){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49437467152672%22%2C%22taskId%22%3A%22necklace_267%22%2C%22lng%22%3A%22118.1447981202065%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=64e2361aa2a81068930c0c3325fd45ef&st=1624950832218&sv=111&uemps=0-0&uts=0f31TVRjBSsMGLCxYS3UIqlZl8dbXmnuZ4ayfhN43Ot1QaV41onc66czNm7agt5ZxuI/ZiEjTyLMd9C68bu6j250BhqFBz9aHYMZHRsZRt99av4Tsia77GOWxlDaSYf5ixm0pZhBRR4OQ%2BUBD6%2BPW4wCMOS5CO3/VI2cFHPfi%2BdGNinbfncIha86vGUGuGKiHSAf4rUFY4wrafX6Rksw7g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  }
  if (type === '4') {
    // https://h5.m.jd.com/babelDiy/Zeus/2fDwtAwAQX1PJh51f3UXzLhKiD86/index.html
    console.log('需等待30秒')
    functionId = 'reportSinkTask'
    body = `&appid=XPMSGC2019&monitorSource=&uuid=16245525345801334814959&body=%7B%22platformType%22%3A%221%22%2C%22taskId%22%3A%22necklace_${id}%22%7D&client=m&clientVersion=4.6.0&area=16_1315_1316_59175&geo=%5Bobject%20Object%5D`
    await $.wait(15000);
  } else {
    // https://h5.m.jd.com/babelDiy/Zeus/3TcqzbLKXwyiGDzrn5nKV7sSEC8N/index.html
    console.log('需等待15秒')
    functionId = 'reportCcTask'
  }
  await $.wait(15500);
  await getCcTaskList(functionId, body, type);
}
function getCcTaskList(functionId, body, type = '3') {
  let url = `https://api.m.jd.com/client.action?functionId=${functionId}`
  return new Promise(resolve => {
    if (functionId === 'getCcTaskList') {

    }
    if (functionId === 'reportCcTask'){

    }
    if (functionId === 'reportSinkTask'){
      url += body
      body = ''
    }
    // if (type === '4' && functionId === 'reportCcTask'){
      // url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1622193986049&sign=f5abd9fd7b9b8abaa25b34088f9e8a54&sv=102`
      // body = `body=${escape(JSON.stringify(body))}`
    // }
    const options = {
      url,
      body,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
	@@ -404,7 +421,7 @@ function getCcTaskList(functionId, body, type = '3') {
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": UA,
      }
    }
    $.post((options), async (err, resp, data) => {
	@@ -415,7 +432,7 @@ function getCcTaskList(functionId, body, type = '3') {
        } else {
          if (safeGet(data)) {
            if (type === '3' && functionId === 'reportCcTask') console.log(`点击首页领券图标(进入领券中心浏览15s)任务:${data}`)
            if (type === '4' && functionId === 'reportSinkTask') console.log(`点击“券后9.9”任务:${data}`)
            // data = JSON.parse(data);
          }
        }
	@@ -443,7 +460,7 @@ function taskPostUrl(function_id, body = {}) {
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": UA
    }
  }
}

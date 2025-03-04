export async function startApiCallsPerformance() {
	await browser.cdp('Network', 'enable');
	const apiTimings = {};
	browser.on('Network.requestWillBeSent', params => {
		const requestId = params.requestId;
		apiTimings[requestId] = { startTime: params.timestamp };
	});
	browser.on('Network.responseReceived', params => {
		const requestId = params.requestId;
		if (apiTimings[requestId]) {
			apiTimings[requestId].endTime = params.timestamp;
		}
	});
	return apiTimings;
}

export async function waitUntilPageLoad(timeoutSecond) {
	await browser.waitUntil(async () => await browser.execute(async () => document.readyState === 'complete'), {
		timeout: (timeoutSecond ?? 1) * 60 * 1000,
		timeoutMsg: 'Oops! Check your internet connection. Page is not completely loaded',
	});
}

export async function endApiCallsPerformance(apiTimings) {
	await waitUntilPageLoad();
	await browser.cdp('Network', 'disable');
	let earliestStartTime = Infinity;
	let latestEndTime = 0;
	for (const timing of Object.values(apiTimings)) {
		if (timing.startTime < earliestStartTime) {
			earliestStartTime = timing.startTime;
		}
		if (timing.endTime > latestEndTime) {
			latestEndTime = timing.endTime;
		}
	}
	return latestEndTime - earliestStartTime;
}

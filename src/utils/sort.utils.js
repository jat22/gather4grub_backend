"use strict";


const sortEventsByDate = (events) => {
	const result = events.sort((a,b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);

		if(dateA < dateB) return -1
		else if(dateA > dateB) return 1
		else return 0
	})

	return result
}

const sortPastUpcoming = (sortedEvents) => {
	const upcoming = [];
	const past = [];
	const now = new Date();

	for(let i = 0; i < sortedEvents.length; i++) {
		const e = sortedEvents[i]
		const date = new Date(e.date)
		
		if(date < now) past.push(e);
		if(date > now) {
			upcoming.push(...sortedEvents.slice(i, sortedEvents.length))
			break
		}
	}
	return {past, upcoming}
}

module.exports = {
	sortEventsByDate,
	sortPastUpcoming
}